import type { MatchView } from '@API/types/MatchView'
import config from '@config/index'
import logger from '@config/logger'
import type { ICourt } from 'types/types'

export const createNewCourtObject = (api_id: number, name: string): ICourt => {
	const court = {
		api_id,
		name,
	}

	return court
}

export const courtHanlder = async (
	courtData: MatchView['extra']['stadium_data'] | undefined,
	matchId: string,
): Promise<ICourt | null> => {
	if (courtData !== undefined) {
		const courtDB = await config.database.services.getters.getCourt(Number(courtData.id))

		if (courtDB !== null) {
			return courtDB
		} else {
			const courtObject = createNewCourtObject(Number(courtData.id), courtData.name)

			if (courtObject.api_id !== undefined && courtObject.name !== undefined && courtObject.name !== '') {
				const savedCourt = await config.database.services.savers.saveNewCourt(courtObject)

				return savedCourt
			} else {
				logger.warn(`There is a court (id: ${courtObject.api_id} - name: ${courtObject.name} ) without a valid name for match id: ${matchId}`)
				return null
			}
		}
	} else {
		return null
	}
}
