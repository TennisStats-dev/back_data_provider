import type { MatchView } from '@API/types/MatchView'
import config from '@config/index'
import type { ICourt } from 'types/schemas'

export const createNewCourtObject = (api_id: number, name: string): ICourt => {
	const court = {
		api_id,
		name,
	}

	return court
}

export const courtHanlder = async (courtData: MatchView['extra']['stadium_data'] | undefined): Promise<ICourt | null> => {

	let court: ICourt

	
	if (courtData !== undefined) {
		const courtDB = await config.database.services.getters.getCourt(Number(courtData.id))

		if (courtDB !== null) {
			court = courtDB
		} else {
			const courtObject = createNewCourtObject(
				Number(courtData.id),
				courtData.name,
			)

			const savedCourt = await config.database.services.savers.saveNewCourt(courtObject)

			court = savedCourt
		}
	} else {
		return null
	}

	return court
}
