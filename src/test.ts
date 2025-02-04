import type { Request, Response } from 'express'
import config from './config'
import { getAllPlayerEndedMatchesFromAPI } from '@services/player.services'

export const getPreMatchDetails = async (req: Request, res: Response): Promise<void> => {
	try {
		const matchId = req.params.id

		const matchDetails = await config.database.services.getters.getPreMatch(Number(matchId))

		res.status(200).send(matchDetails)
	} catch (err) {
		res.status(402).send(err)
	}
}

export const getEndedMatchDetails = async (req: Request, res: Response): Promise<void> => {
	try {
		const matchId = req.params.id

		const matchDetails = await config.database.services.getters.getEndedMatch(Number(matchId))

		res.status(200).send(matchDetails)
	} catch (err) {
		res.status(402).send(err)
	}
}

export const getAllPlayerEndedMatchesDetails = async (req: Request, res: Response): Promise<void> => {
	try {
		const playerId = req.params.id

		const matchesDetailsDB = await config.database.services.getters.getAllPlayerEndedMatchesByApi_id(Number(playerId))
		const matchesDetailsAPI = await getAllPlayerEndedMatchesFromAPI(Number(playerId))

		const notStoredMatches = matchesDetailsAPI.map((matchAPI) => {
			let exists = false

			matchesDetailsDB?.forEach((matchDB) => {
				if (matchDB.api_id === Number(matchAPI.id)) {
					exists = true
				}
			})

			if (!exists) {
				return matchAPI
			}

            return null
		}).filter(match => match)

		res.status(200).send({ totalDB: matchesDetailsDB?.length, totalAPI: matchesDetailsAPI?.length,  notStored: notStoredMatches, stored: matchesDetailsDB })
	} catch (err) {
		res.status(402).send(err)
	}
}
