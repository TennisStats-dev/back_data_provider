import config from '@config/index'
import logger from '@config/logger'
import { saveAllPlayerMatches } from '@services/player.services'
import { msToStringTime } from '@utils/msToStringTime'

export const savePlayersHistoriesCron = async (): Promise<void> => {

	try {
		const startDate = new Date()
		// logger.info('+++++++++++++++++++++++++++++++++++++++++++++++')
		// logger.info(`UPDATE MATCHES HISTORIES started at: ${startDate.toString()}`)
		// logger.info('+++++++++++++++++++++++++++++++++++++++++++++++')
		let matchesHistoryUpdated = 0
		const upcomingMatchesDB = await config.database.services.getters.getAllPreMatches()

		if (upcomingMatchesDB !== null) {
			for (const matchDB of upcomingMatchesDB) {
				await saveAllPlayerMatches(matchDB.home.api_id)
				matchesHistoryUpdated++
				await saveAllPlayerMatches(matchDB.away.api_id)
				matchesHistoryUpdated++
			}
		}

		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())

		logger.info('+++++++++++++++++++++++++++++++++++++++++++++++')
		logger.info(`${matchesHistoryUpdated} UPDATED match histories`)
		logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
		logger.info('+++++++++++++++++++++++++++++++++++++++++++++++')
	} catch (error) {
		logger.error(error)
	}
}
