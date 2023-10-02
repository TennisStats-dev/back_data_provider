import config from '@config/index'
import logger from '@config/logger'
import { getTournamentCircuit } from '@services/tournament.services'
import type { Request, Response } from 'express'
import type { ITournament } from 'types/schemas'

export const updateTournamentCircuit = async (_req: Request, _res: Response): Promise<void> => {
	const allTournamentDB = await config.database.services.getters.getAllTournaments()
	const updatedTournaments: ITournament[] = []

	const nonCircuitTournaments = allTournamentDB?.filter((tournaments) => tournaments.circuit === undefined)

	if (nonCircuitTournaments === undefined) {
		logger.info('All tournaments have a circuit assigned')
		return
	}

	logger.info(`${nonCircuitTournaments.length} tournaments are missing the circuit`)

	for (const tournament of nonCircuitTournaments) {
		const circuitData = getTournamentCircuit(tournament.name, tournament.api_id)

		if (circuitData !== undefined) {
			tournament.circuit = circuitData

			const updatedTournament = await tournament.save()
            updatedTournaments.push(updatedTournament)
		}
	}

    logger.info(`${updatedTournaments.length} tournaments updated - DETAILS: `)
    logger.info(updatedTournaments)
}
