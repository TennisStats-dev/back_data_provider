import config from "@config/index"
import logger from "@config/logger"
import { getMatchWinner, getformattedResult } from "@services/match.services"
import { msToStringTime } from "@utils/msToStringTime"
import type { Request, Response } from "express"

export const udpateEndedMatchesResult = async (_req: Request, _res: Response): Promise<void> => {
	try {
		logger.info('-----------------------------------------------')
		const startDate = new Date()
		logger.info(`update ended matches result started at: ${startDate.toString()}`)

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
            const eventViewAPIResponse = await config.api.services.getEventView(issue.matchId)

            if(eventViewAPIResponse.ss !== null ) {
                const formattedResult = await getformattedResult(eventViewAPIResponse.ss, issue.home, issue.away, eventViewAPIResponse.time_status, issue.matchId)
                const winner = getMatchWinner(formattedResult, issue.home, issue.away, issue.matchId)

                const endedMatchToUpdate = await config.database.services.getters.getEndedMatch(issue.matchId)

                if (endedMatchToUpdate !== null) {
                    endedMatchToUpdate.match_stats.result = formattedResult
                    endedMatchToUpdate.match_stats.winner = winner

                    await endedMatchToUpdate.save()

                    resultMatchesFixedCount++

                    const endedMatchIssueDeleted = await config.database.services.deleters.deleteEndedMatchIssue(issue.matchId)

                    if (endedMatchIssueDeleted) {
                        IssuesDeletedCount++
                    }
                }
            }
        }

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		logger.info(`${resultMatchesFixedCount} FIXED ended matches result`)
		logger.info(`${IssuesDeletedCount} DELETED ended matches issues`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
	} catch (err) {
		logger.error(err)
	}
}