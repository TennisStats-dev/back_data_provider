import config from '@config/index'
import logger from '@config/logger'
import { updateMatchData } from '@services/match.services'
import { msToStringTime } from '@utils/msToStringTime'

export const updateUpcomingMatchesDataCron = async (): Promise<void> => {
    try{
        const startDate = new Date()
		// logger.info('***********************************************')
		// logger.info(`UPDATE PREMATCH DATA started at: ${startDate.toString()}`)
		// logger.info('***********************************************')
	
        let preMatchUpdated = 0
        const upcomingMatchesDB = await config.database.services.getters.getAllPreMatches()
        
        if (upcomingMatchesDB !== null) {
            for (const matchDB of upcomingMatchesDB) {
                const eventViewAPIResponse = await config.api.services.getEventView(matchDB.api_id)
                
                await updateMatchData(matchDB, eventViewAPIResponse)
                await matchDB.save()
                preMatchUpdated++
            }
        }
        
		const finishDate = new Date()
		const duration = msToStringTime(finishDate.getTime() - startDate.getTime())
		
        logger.info('***********************************************')
        logger.info(`${preMatchUpdated} UPDATED pre matches`)
        logger.info(`The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`)
        logger.info('***********************************************')
    } catch (error) {
        logger.error(error)
    }
}
