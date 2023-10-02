import logger from '@config/logger'
import PreMatch from '@database/models/preMatch.model'
import ResultIssue from '@database/models/resultIssue.model'

const deletePreMatch = async (api_id: number): Promise<boolean> => {
	try {
		const isDeteleted = await PreMatch.deleteOne({
			api_id,
		})

		return isDeteleted.acknowledged
	} catch (err) {
		console.log(err)
		logger.error('Error deleting a pre match')
		throw new Error('Error deleting a pre match')
	}
}

const deleteEndedMatchIssue = async (matchId: number): Promise<boolean> => {
	try {
		const isDeteleted = await ResultIssue.deleteOne({
			matchId,
		})

		return isDeteleted.acknowledged
	} catch (err) {
		console.log(err)
		logger.error('Error deleting an ended match issue')
		throw new Error('Error deleting an ended match issue')
	}
}

const DELETE = {
	deletePreMatch,
	deleteEndedMatchIssue,
}

export default DELETE
