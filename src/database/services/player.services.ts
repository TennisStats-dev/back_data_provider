import logger from '@config/logger'
import { Player, TempPlayer } from '@database/models/player.model'
import type { IPlayer } from 'types/schemas'
import { validateAtribute } from 'services/validateAtribute'

export const checkIfPlayerExists = async (api_id: number): Promise<boolean> => {
	const existingPlayer = await Player.findOne({
		api_id,
	})
	const existingTempPlayer = await TempPlayer.findOne({
		api_id,
	})

	return existingPlayer != null || existingTempPlayer != null
}

export const saveNewTempPlayer = async ({ api_id, name, gender, birth, image_id, cc }: IPlayer): Promise<void> => {
	const playerData: IPlayer = {
		name,
		api_id,
		gender,
	}

	if (validateAtribute.image_id(image_id)) {
		playerData.image_id = image_id
	}
	if (validateAtribute.birth(birth)) {
		playerData.birth = birth
	}
	if (validateAtribute.cc(cc)) {
		playerData.cc = cc
	}

	const newTempPlayer = new TempPlayer(playerData)

	const savedTempPlayer = await newTempPlayer.save()

	if (savedTempPlayer !== undefined) {
		logger.info('New temporal player saved: name: ' + name + 'id: ' + api_id)
	} else {
		logger.error('Error trying to save a new temporal player. Name: ' + name + 'id: ' + api_id)
	}
}
