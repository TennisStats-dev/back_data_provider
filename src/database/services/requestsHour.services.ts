import logger from '@config/logger'
import RequestsInfo from '@database/models/requestsInfo.model'
import { hours } from 'constants/data'
import type { IRequestsInfo } from 'types/schemas'
import { generateFormatDate } from 'utils/formatDate'

export const checkIfCanProceed = async (date: Date, numReqToDo: number): Promise<boolean> => {
	if (numReqToDo > 3500) {
		logger.warn('The server tries to accomplish more than 3500 requests at once')
		return false
	}

	const hour = date.getHours()
	const formattedDate = generateFormatDate(date)

	const existingRequestInfoDay: IRequestsInfo | null = await RequestsInfo.findOne({
		date: formattedDate,
	})

	if (existingRequestInfoDay === null) {
		logger.info(`No request info was created for day: ${formattedDate} Can proceed`)
		await saveNewRequestInfoDay(date)
		return true
	}

	const petitionsAlreadyDone = existingRequestInfoDay.hour[hour].requests
    if (petitionsAlreadyDone + numReqToDo > 3500) {
        logger.warn(`Se ha llegado al límite de 3500 requests la hora para el dia ${formattedDate}, hora ${hour}`)
        return false
    }
	return true
}

export const saveNewRequestInfoDay = async (date: Date): Promise<void> => {
	const formattedDate = generateFormatDate(date)

	const requestInfoData: IRequestsInfo = {
		date: formattedDate,
		hour: hours.map((hour) => {
			return {
				number: hour,
				requests: 0,
			}
		}),
	}

	const newRequestInfoDay = new RequestsInfo(requestInfoData)

	const savedRequestInfoDay = await newRequestInfoDay.save()

	if (savedRequestInfoDay !== undefined) {
		logger.info('New requests info saved on day: ', requestInfoData.date)
	} else {
		logger.error('Error trying to save a new request info on day: ', requestInfoData.date)
	}
}

export const saveRequests = async (date: Date, requests: number): Promise<void> => {
	const hour = date.getHours()
	const formattedDate = generateFormatDate(date)

	const existingRequestInfoDay = await RequestsInfo.findOne({
		date: formattedDate,
	})

	if (existingRequestInfoDay === null) {
		await saveNewRequestInfoDay(date)
		await saveRequests(date, requests)
	} else {
		const newRequests = existingRequestInfoDay.hour[hour].requests + requests
		existingRequestInfoDay.hour[hour].requests = newRequests
		await existingRequestInfoDay.save()
		logger.info('Requests saved for day', formattedDate, ' and hour', hour)
	}
}
