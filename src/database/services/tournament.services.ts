import logger from '@config/logger'
import Tournament from '@database/models/tournament.model'
import type { ITournament } from 'types/schemas'
import { validateAtribute } from 'services/validateAtribute'

export const checkIfTournamentExists = async (api_id: number): Promise<boolean> => {
	const existingTorunament = await Tournament.findOne({
		api_id,
	})

	return existingTorunament != null
}

export const saveNewTournament = async ({
	api_id,
	name,
	best_of_sets,
	ground,
	city,
	cc,
}: ITournament): Promise<void> => {
	const tournamentData: ITournament = {
		name,
		api_id,
		best_of_sets,
		ground,
		city,
	}

	if (validateAtribute.cc(cc)) {
		tournamentData.cc = cc
	}

	const newTournament = new Tournament(tournamentData)

	const savedTournament = await newTournament.save()

	if (savedTournament !== undefined) {
		logger.info('New tournament saved: name: ' + name + 'id: ' + api_id)
	} else {
		logger.error('Error trying to save a new tournament. Name: ' + name + 'id: ' + api_id)
	}
}
