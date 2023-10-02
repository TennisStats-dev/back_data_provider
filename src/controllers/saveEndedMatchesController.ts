import config from '@config/index'
import logger from '@config/logger'
import { endedMatchStatus } from '@constants/data'
import { createNewEndedMatchObject } from '@services/match.services'
import { msToStringTime } from '@utils/msToStringTime'
import type { Request, Response } from 'express'
import type { IMatch } from 'types/schemas'

export const saveEndedMatches = async (_req: Request, _res: Response): Promise<void> => {
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
			const eventViewAPIResponse = await config.api.services.getEventView(match.api_id)

			if (eventViewAPIResponse === undefined) {
				logger.warn(
					`!!! The match with the id ${match.api_id}, tournament ID: ${match.tournament.api_id}, players: ${match.home.api_id} vs ${match.away.api_id} doesn't have an event view !!! - check whether there is the corresponding match with another ID or not`,
				)

				const preMatchisDeleted = await config.database.services.deleters.deletePreMatch(match.api_id)

				if (preMatchisDeleted) {
					deletedPreMatchesCount++
				}

				continue
			}

			const { ss, stats, events, time_status } = eventViewAPIResponse

			if (!endedMatchStatus.includes(Number(time_status))) {
				continue
			}

			const matchData = match.toObject()

			const endedMatchData = createNewEndedMatchObject(
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
	} catch (err) {
		logger.error(err)
	}
}

export const saveEndedMatchesFunc = async (): Promise<void> => {
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
			const eventViewAPIResponse = await config.api.services.getEventView(match.api_id)

			if (eventViewAPIResponse === undefined) {
				logger.warn(
					`!!! The match with the id ${match.api_id} doesn't have an event view !!! - check whether there is the corresponding match with another ID or not`,
				)

				const preMatchisDeleted = await config.database.services.deleters.deletePreMatch(match.api_id)

				if (preMatchisDeleted) {
					deletedPreMatchesCount++
				}

				continue
			}

			const { ss, stats, events, time_status } = eventViewAPIResponse

			if (!endedMatchStatus.includes(Number(time_status))) {
				continue
			}

			const matchData = match.toObject()

			const endedMatchData = createNewEndedMatchObject(
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
	} catch (err) {
		logger.error(err)
	}
}
