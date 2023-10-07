import logger from "@config/logger"
import { saveUpcomingMatchesCron } from "./saveUpcomingMatchesController"
import { saveEndedMatchesFromPrematchesCron } from "./saveEndedMatchesFromPreMatchesController"
import { udpateEndedMatchesResultCron } from "./updateEndedMatchResult"

export const runCron = async (): Promise<void> => {
    try {
        await saveUpcomingMatchesCron()
        await saveEndedMatchesFromPrematchesCron()
        await udpateEndedMatchesResultCron()
    } catch (error) {
        console.log(error)
        logger.error('Error while executing cron')
    }
}