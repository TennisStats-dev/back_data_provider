import config from '@config/index'
import logger from '@config/logger'
import { getMatchWinner, getformattedResult } from '@services/match.services'
import { msToStringTime } from '@utils/msToStringTime'
import type { Request, Response } from 'express'
import type { IGameStats, ISetStats } from 'types/types'

export const udpateEndedMatchesResult = async (_req: Request, _res: Response): Promise<void> => {
	await udpateEndedMatchesResultCron()
}

export const udpateEndedMatchesResultCron = async (): Promise<void> => {
	try {
		const startDate = new Date()
		// logger.info('...............................................')
		// logger.info(`update ended matches result started at: ${startDate.toString()}`)
		// logger.info('...............................................')

		const nullResultMatches = await config.database.services.getters.getAllEndedMatchesIssues()

		let resultMatchesFixedCount = 0
		let IssuesDeletedCount = 0

		if (nullResultMatches === null) {
			logger.info('There are no issues with ended matches result')
			const finishDate = new Date()
			const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
			logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)

			return
		}

		for (const issue of nullResultMatches) {
			const endedMatch = await config.database.services.getters.getEndedMatch(issue.matchId)

			if (endedMatch === null) {
				logger.warn(
					`Match: ${issue.matchId} has stored as result issue but there is no corresponding endedMatch stored in DB`,
				)
				continue
			}

			const eventViewAPIResponse = await config.api.services.getEventView(issue.matchId)

			if (eventViewAPIResponse?.ss !== null && eventViewAPIResponse?.ss !== undefined) {
				const formattedResult = await getformattedResult(
					eventViewAPIResponse.ss,
					issue.home,
					issue.away,
					eventViewAPIResponse.time_status,
					issue.matchId,
					eventViewAPIResponse.league.name,
				)

				if (formattedResult === 'Not updated') {
					continue
				}

				const winner = getMatchWinner(formattedResult, issue.home, issue.away, issue.matchId)

				endedMatch.match_stats.result = formattedResult
				endedMatch.match_stats.winner = winner

				const setStats: ISetStats[] = []

				if (
					Array.isArray(formattedResult) &&
					eventViewAPIResponse.events !== undefined &&
					eventViewAPIResponse.events.length > 0
				) {
					const totalGamesPerSet = formattedResult.map((stringRes) => {
						return stringRes
							.split('-')
							.map((stringRes) => Number(stringRes))
							.reduce((a, b): number => a + b)
					})

					totalGamesPerSet.forEach((gamesSet, index) => {
						const gameStats = eventViewAPIResponse.events.splice(0, gamesSet).map((game): IGameStats => {
							return {
								summary: game.text,
							}
						})

						setStats.push({
							number: index + 1,
							games_stats: gameStats,
						})
					})

					endedMatch.sets_stats = setStats
				}

				const savedMatch = await endedMatch.save()

				console.log(`Result match updated ${savedMatch.api_id}`)

				resultMatchesFixedCount++

				const endedMatchIssueDeleted = await config.database.services.deleters.deleteEndedMatchIssue(issue.matchId)

				if (endedMatchIssueDeleted) {
					IssuesDeletedCount++
				}
			}
		}

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		logger.info('...............................................')
		logger.info(`${resultMatchesFixedCount} FIXED ended matches result`)
		logger.info(`${IssuesDeletedCount} DELETED ended matches issues`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
		logger.info('...............................................')
	} catch (err) {
		logger.error(err)
	}
}
