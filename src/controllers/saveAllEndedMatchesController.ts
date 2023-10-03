import config from '@config/index'
import logger from '@config/logger'
import { gender, type } from '@constants/data'
import { courtHanlder } from '@services/court.services'
import { createNewEndedMatchObject, createNewPreMatchObject, getAllEndedMatchesFromAPI } from '@services/match.services'
import { preMatchOddsHandler } from '@services/odds.services'
import { createNewPlayerObject, playerHandler } from '@services/player.services'
import { tournamentHandler } from '@services/tournament.services'
import { msToDateTime } from '@utils/msToDateTime'
import { msToStringTime } from '@utils/msToStringTime'
import type { Request, Response } from 'express'
import type { Document } from 'mongoose'
import type { ICourt, IMatch, IPlayer, IPreOdds, ITournament } from 'types/schemas'

export const saveAllEndedMatches = async (_req: Request, _res: Response): Promise<void> => {
	try {
		logger.info('-----------------------------------------------')
		const startDate = new Date()
		logger.info(`Save all ended matches started at: ${startDate.toString()}`)

		const newMatchesSaved: IMatch[] = []
		let preMatchesPadel = 0
		let endedMatchesToBeFixed = 0
		let endedMatchAlradyStored = 0
		let upcomingMatchesDeleted = 0

		const allEndedMatchesAPI = await getAllEndedMatchesFromAPI()
		const endedMatchesDB = await config.database.services.getters.getAllEndedMatches()

		for (const match of allEndedMatchesAPI) {
			console.log(match.id)
			if (match.league.name.includes('Padel')) {
				preMatchesPadel++
				continue
			}

			if (Number(match.time_status) === config.api.constants.matchStatus['2']) {
				endedMatchesToBeFixed++
				continue
			}

			let matchDB: (IMatch & Document<any, any, any>) | undefined

			if (endedMatchesDB !== null) {
				matchDB = endedMatchesDB.find((matchDB) => matchDB?.api_id === Number(match?.id))
			}

			if (matchDB !== null && matchDB !== undefined) {
				endedMatchAlradyStored++
				continue
			}

			const eventViewAPIResponse = await config.api.services.getEventView(Number(match.id))

			const tournament: ITournament = await tournamentHandler(
				Number(match.id),
				Number(match.league.id),
				match.league.name,
				match.league.cc,
				eventViewAPIResponse,
			)

			const matchGender =
				tournament.type === type.women || tournament.type === type.womenDoubles ? gender.female : gender.male

			const playersArray: IPlayer[] = [
				createNewPlayerObject(Number(match.home.id), match.home.name, matchGender, match.home.cc),
				createNewPlayerObject(Number(match.away.id), match.away.name, matchGender, match.away.cc),
			]

			const { home, away } = await playerHandler(playersArray, tournament.type, matchGender)

			const court: ICourt | null = await courtHanlder(eventViewAPIResponse?.extra?.stadium_data)

			const pre_odds: IPreOdds | null = await preMatchOddsHandler(Number(eventViewAPIResponse.bet365_id), Number(match.id))

			if (home !== null && away !== null) {
				const preMatchData = createNewPreMatchObject(
					Number(match.id),
					Number(eventViewAPIResponse.bet365_id),
					Number(match.sport_id),
					tournament.type,
					match?.round,
					tournament,
					court,
					home,
					away,
					match.time_status,
					msToDateTime(match.time),
					pre_odds,
				)

				const { ss, stats, events, time_status } = eventViewAPIResponse

				const endedMatchData = await createNewEndedMatchObject(
					time_status,
					preMatchData,
					ss,
					stats?.aces,
					stats?.double_faults,
					stats?.win_1st_serve,
					stats?.break_point_conversions,
					events,
				)

				if (endedMatchData === undefined) {
					continue
				}

				const savedEndedMatch = await config.database.services.savers.saveNewEndedMatch(endedMatchData)

				const upcomingMatchDB = await config.database.services.deleters.deletePreMatch(savedEndedMatch.api_id)

				if (matchDB !== undefined && upcomingMatchDB) {
					upcomingMatchesDeleted++
				}

				newMatchesSaved.push(savedEndedMatch)
			} else {
				logger.error(
					'There was an error trying to create a new pre match object due to problems with assignation of the players (promises not resolved on time)',
				)
			}
		}

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		logger.info(
			`${newMatchesSaved.length} SAVED ended matches || ${preMatchesPadel} AVOIDED Padel ended matches || ${endedMatchAlradyStored} ended matches already stored || ${endedMatchesToBeFixed} ended matches to be Fixed || ${upcomingMatchesDeleted} upcoming matches deleted from DB`,
		)
		const iteratedMatches = newMatchesSaved.length + preMatchesPadel + endedMatchAlradyStored + endedMatchesToBeFixed
		logger.info(`ITERATIONS: ${iteratedMatches}`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
	} catch (err) {
		logger.error(err)
	}
}
