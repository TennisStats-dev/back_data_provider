import logger from '@config/logger'
import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import RequestsInfo from '@database/models/requestsInfo.model'
import Tournament from '@database/models/tournament.model'
import { hours } from '@constants/data'
import type { Document } from 'mongoose'
import type { ICourt, IPlayer, IPreMatch, IRequestsInfo, ITournament } from 'types/schemas'
import { createError } from '@utils/createError'

const saveNewCourt = async (courtData: ICourt): Promise<ICourt & Document> => {
	try {
		const newCourt = new Court(courtData)
		const savedCourt = await newCourt.save()

		logger.info(`New court saved - NAME: ${savedCourt.name} - ID: ${savedCourt.api_id}`)
		return savedCourt
	} catch (err) {
		throw createError(err, 'save new court', { api_id: courtData.api_id, collection: 'court' })
	}
}

const saveNewPlayer = async (playerData: IPlayer): Promise<IPlayer & Document> => {
	try {

		console.log('jugador guardándose:', playerData)
		const newPlayer = new Player(playerData)

		console.log('jugador del modelo creado', newPlayer)
		const savedPlayer = await newPlayer.save()

		logger.info(`New player saved - NAME: ${savedPlayer.name} - ID: ${savedPlayer.api_id}`)
		return savedPlayer
	} catch (err) {

		throw createError(err, 'save new player', { api_id: playerData.api_id, collection: 'Player' })
	}
}

const saveNewTournament = async (tournamentData: ITournament): Promise<ITournament & Document> => {
	try {
		const newTournament = new Tournament(tournamentData)

		const savedTournament = await newTournament.save()
		logger.info(`New tournament saved - NAME: ${savedTournament.name} - ID: ${savedTournament.api_id}`)

		return savedTournament
	} catch (err: any) {
		throw createError(err, 'save new tournament', { api_id: tournamentData.api_id, collection: 'tournament' })
	}
}

const saveNewPreMatch = async (matchData: IPreMatch): Promise<IPreMatch & Document> => {
	try {

		console.log(matchData)
		const newPreMatch = new PreMatch(matchData)

		const savedPreMatch = await newPreMatch.save()

		logger.info(
			`New pre match saved - ID: ${savedPreMatch.api_id} - P1: ${matchData.home.api_id} - - P2: ${matchData.away.api_id}`,
		)
		return savedPreMatch
	} catch (err) {
		console.log(err)
		throw createError(err, 'save new preMatch', { api_id: matchData.api_id, collection: 'preMatch' })
	}
}

const saveNewRequestInfo = async (formattedDate: string): Promise<IRequestsInfo & Document> => {
	try {
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

		return savedRequestInfoDay
	} catch (err) {
		throw createError(err, 'save new requestsInfo', { collection: 'requestsInfo' })
	}
}

const SAVE = {
	saveNewCourt,
	saveNewRequestInfo,
	saveNewPlayer,
	saveNewTournament,
	saveNewPreMatch
}

export default SAVE
