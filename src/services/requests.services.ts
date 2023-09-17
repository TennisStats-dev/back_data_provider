import config from '@config/index'
import logger from '@config/logger'
import { generateFormatDate } from 'utils/formatDate'

export const checkIfCanProceedOnDB = async (date: Date, numReqToDo: number): Promise<boolean> => {
	if (numReqToDo > config.api.requests.maxToProceed) {
		logger.warn('The server is trying to accomplish more than 3500 requests at once')
		return false
	}

    const hour = date.getHours()
    const formattedDate = generateFormatDate(date)

    const existingRequestsInfoDay = await config.database.services.getters.getRequestsInfo(formattedDate)

	if (existingRequestsInfoDay === null) {
        await config.database.services.savers.saveNewRequestInfo(formattedDate)
		return true
	}

	const petitionsAlreadyDone = existingRequestsInfoDay.hour[hour].requests
    if (petitionsAlreadyDone + numReqToDo > config.api.requests.maxToProceed) {
        logger.warn(`The server tried to surpass the request limit of 3500 per hour on ${formattedDate} and at ${hour}`)
        return false
    }
	return true
}