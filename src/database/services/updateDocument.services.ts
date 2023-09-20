import config from '@config/index'
import logger from '@config/logger'
import RequestsInfo from '@database/models/requestsInfo.model'
import { createError } from '@utils/createError'
import { generateFormatDate } from '@utils/formatDate'

export const updateRequestsInfo = async (date: Date): Promise<void> => {
	try {
		const hour = date.getHours()
		const formattedDate = generateFormatDate(date)

		const existingRequestInfoDay = await RequestsInfo.findOne({
			date: formattedDate,
		})

		if (existingRequestInfoDay === null) {
			await config.database.services.savers.saveNewRequestInfo(formattedDate)
			await updateRequestsInfo(date)
		} else {
			const newRequests = existingRequestInfoDay.hour[hour].requests + 1
			existingRequestInfoDay.hour[hour].requests = newRequests
			await existingRequestInfoDay.save()
			if (newRequests >= config.api.requests.limitToWarn) {
				logger.warn(`The server is up to exceed the limit of requests per hour on date: ${formattedDate} - hour: ${hour}`)
			}
		}
	} catch (err) {
		throw createError(err, 'update requestsInfo', { collection: 'requestsInfo' })
	}
}

const UPDATE = {
	updateRequestsInfo,
}
export default UPDATE
