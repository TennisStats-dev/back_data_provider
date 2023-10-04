import config from '@config/index'
import logger from '@config/logger'
import { endedMatchStatus } from '@constants/data'
import { createNewEndedMatchObject, getMatchStatus } from '@services/match.services'
import { msToStringTime } from '@utils/msToStringTime'
import type { NextFunction, Request, Response } from 'express'
import type { IMatch, INotFoundMatch, IPreMatch } from 'types/types'

export const saveEndedMatchesFromPrematches = async (
	_req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		logger.info('-----------------------------------------------')
		const startDate = new Date()
		logger.info(`Save ended matches from upcoming matches started at: ${startDate.toString()}`)

		const upcomingMatchesDB = await config.database.services.getters.getAllPreMatches()

		if (upcomingMatchesDB === null) {
			logger.info('The upcoming matches collection (PreMatch) is empty')
			return
		}

		const newEndedMatchesSaves: IMatch[] = []
		let deletedPreMatchesCount: number = 0

		for (const match of upcomingMatchesDB) {
			const endedMatchDB = await config.database.services.getters.getEndedMatch(match.api_id)

			if (endedMatchDB !== null) {
				const preMatchIsDeleted = await config.database.services.deleters.deletePreMatch(match.api_id)

				if (preMatchIsDeleted) {
					deletedPreMatchesCount++
				}
				continue
			}

			const eventViewAPIResponse = await config.api.services.getEventView(match.api_id)

			if (eventViewAPIResponse === undefined) {
				const details = `!!! The match with the id ${match.api_id}, tournament ID: ${match.tournament.api_id} and name ${match.tournament.name}, players: ${match.home.api_id}: ${match.home.name} vs ${match.away.api_id}: ${match.away.name} doesn't have an event view !!! - check whether there is the corresponding match with another ID or not`
				logger.warn(details)

				const matchNotFoundObject: INotFoundMatch = {
					matchId: Number(match.api_id),
					home: {
						api_id: match.home.api_id,
						name: match.home.name,
					},
					away: {
						api_id: match.away.api_id,
						name: match.away.name,
					},
					tournament: {
						api_id: match.tournament.api_id,
						name: match.tournament.name,
					},
					details,
				}
				await config.database.services.savers.saveNewMatchNotFound(matchNotFoundObject)

				const preMatchIsDeleted = await config.database.services.deleters.deletePreMatch(match.api_id)

				if (preMatchIsDeleted) {
					deletedPreMatchesCount++
				}

				continue
			}

			const { ss, stats, events, time_status } = eventViewAPIResponse

			if (!endedMatchStatus.includes(Number(time_status))) {
				continue
			}

			const matchData: IPreMatch = match.toObject()

			matchData.status = getMatchStatus(Number(eventViewAPIResponse.time_status), match.api_id)

			const endedMatchData = await createNewEndedMatchObject(
				time_status,
				matchData,
				ss,
				stats?.aces,
				stats?.double_faults,
				stats?.win_1st_serve,
				stats?.break_point_conversions,
				events,
			)

			const savedEndedMatch = await config.database.services.savers.saveNewEndedMatch(endedMatchData)

			const preMatchisDeleted = await config.database.services.deleters.deletePreMatch(match.api_id)

			if (preMatchisDeleted) {
				deletedPreMatchesCount++
			}

			newEndedMatchesSaves.push(savedEndedMatch)
		}

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		logger.info(`${newEndedMatchesSaves.length} SAVED ended matches`)
		logger.info(`${deletedPreMatchesCount} DELETED pre matches`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)

		next()
	} catch (err) {
		logger.error(err)
	}
}
