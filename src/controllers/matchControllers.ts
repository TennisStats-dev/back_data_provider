import logger from '@config/logger'
import type { Request, Response } from 'express'
import config from '@config/index'
import { gender, type } from '@constants/data'
import type { ICourt, IPlayer, IPreMatch, IPreOdds, ITournament } from 'types/schemas'
import { createNewPreMatchObject, getUpcomingMatchesFromAPI } from '@services/match.services'
import { createNewPlayerObject, playerHandler } from '@services/player.services'
import { courtHanlder } from '@services/court.services'
import { tournamentHandler } from '@services/tournament.services'
import { msToTime } from '@utils/msToTime'
import { preMatchOddsHandler } from '@services/odds.services'

export const saveUpcomingMatches = async (_req: Request, _res: Response): Promise<void> => {
	try {
		const startDate = new Date()
		logger.info(`Save upcoming matches started at: ${startDate.toString()}`)

		const newMatchesSaved: IPreMatch[] = []

		const allUpcomingMatches = await getUpcomingMatchesFromAPI()

		for (const match of allUpcomingMatches) {
			if ((await config.database.services.getters.getPreMatch(Number(match.id))) !== null) {
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
					new Date(Number(match.time) * 1000),
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
		const duration = msToTime(finishDate.getTime() - startDate.getTime())
		// newMatchesSaved.forEach(match => {console.log(`${match.api_id} - `)})
		logger.info(
			`${
				newMatchesSaved.length
			} matches have been saved - The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`,
		)
	} catch (err) {
		logger.error(err)
	}
}
