import logger from "@config/logger"
import Court from "@database/models/court.model"
import type { ICourt } from "types/schemas"

export const checkIfCourtExists = async (api_id: number): Promise<boolean> => {
	const existingCourt = await Court.findOne({
		api_id,
	})

	return existingCourt != null
}

export const saveNewCourt = async ({api_id, name}: ICourt): Promise<void> => {    
    const courtData: ICourt = {
        name,
        api_id,
    }

    const newCourt = new Court(courtData)

    const savedCourt = await newCourt.save()
    
    if (savedCourt !== undefined) {
        logger.info('New court saved: name: ' + name + 'id: ' + api_id)
    } else {
        logger.error('Error trying to save a new court. Name: ' + name + 'id: ' + api_id)
    }
}