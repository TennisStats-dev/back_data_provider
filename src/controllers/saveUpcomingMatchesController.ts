import logger from '@config/logger'
import type { Request, Response, NextFunction } from 'express'
import config from '@config/index'
import { gender, type } from '@constants/data'
import type { ICourt, IPlayer, IPreMatch, IPreOdds, ITournament } from 'types/types'
import { createNewPreMatchObject, getUpcomingMatchesFromAPI, updateMatchData } from '@services/match.services'
import { createNewPlayerObject, playerHandler } from '@services/player.services'
import { courtHanlder } from '@services/court.services'
import { tournamentHandler } from '@services/tournament.services'
import { preMatchOddsHandler } from '@services/odds.services'
import { msToDateTime } from '@utils/msToDateTime'
import { msToStringTime } from '@utils/msToStringTime'
import type { Document } from 'mongoose'

export const saveUpcomingMatches = async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
	try {
		logger.info('-----------------------------------------------')
		const startDate = new Date()
		logger.info(`Save upcoming matches started at: ${startDate.toString()}`)

		const newMatchesSaved: IPreMatch[] = []
		let preMatchUpdated = 0
		let preMatchPadel = 0

		const allUpcomingMatchesAPI = await getUpcomingMatchesFromAPI()
		const upcomingMatchesDB = await config.database.services.getters.getAllPreMatches()

		for (const match of allUpcomingMatchesAPI) {
			if (match.league.name.includes('Padel')) {
				preMatchPadel++
				continue
			}

			// Temporary logger to monitorize which types have the upcoming matches coming from API
			if (match.time_status !== '0') {
				logger.warn(`The match with id ${match.id} has a status of ${match.time_status}`)
			}

			const eventViewAPIResponse = await config.api.services.getEventView(Number(match.id))

			let matchDB: (IPreMatch & Document<any, any, any>) | undefined

			if (upcomingMatchesDB !== null) {
				matchDB = upcomingMatchesDB.find((matchDB) => matchDB?.api_id === Number(match?.id))
			}

			if (matchDB !== null && matchDB !== undefined) {
				await updateMatchData(matchDB, match, eventViewAPIResponse)
				await matchDB.save()
				preMatchUpdated++
				continue
			}

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

			const pre_odds: IPreOdds | null = await preMatchOddsHandler(Number(match.bet365_id), Number(match.id))

			if (home !== null && away !== null) {
				const preMatchObject = createNewPreMatchObject(
					Number(match.id),
					Number(match.bet365_id),
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

				const savedPreMatch = await config.database.services.savers.saveNewPreMatch(preMatchObject)

				newMatchesSaved.push(savedPreMatch)
			} else {
				logger.error(
					'There was an error trying to create a new pre match object due to problems with assignation of the players (promises not resolved on time)',
				)
			}
		}

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		logger.info(`${newMatchesSaved.length} SAVED pre matches`)
		logger.info(`${preMatchPadel} AVOIDED Padel pre matches`)
		logger.info(`${preMatchUpdated} UPDATED pre matches`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
	} catch (err) {
		logger.error(err)
	}

	next()
}
