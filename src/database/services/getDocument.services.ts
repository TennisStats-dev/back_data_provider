import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import RequestsInfo from '@database/models/requestsInfo.model'
import { Team } from '@database/models/team.model'
import Tournament from '@database/models/tournament.model'
import type { Document } from 'mongoose'
import type { ICourt, IPlayer, IPreMatch, IRequestsInfo, ITeam, ITournament } from 'types/schemas'
import { createError } from 'utils/createError'

const getCourt = async (api_id: number): Promise<ICourt & Document | null> => {
	try {
		const existingCourt = await Court.findOne({
			api_id,
		})

		return existingCourt
	} catch (err) {
		throw createError(err, 'get court', { api_id, collection: 'court' })
	}
}

const getPlayer = async (api_id: number): Promise<IPlayer & Document | null> => {
	try {
		const existingPlayer = await Player.findOne({
			api_id,
		})

		return existingPlayer
	} catch (err) {
		throw createError(err, 'get player', { api_id, collection: 'player' })
	}
}

const getPreMatch = async (api_id: number): Promise<IPreMatch & Document | null> => {
	try {
		const existingPreMatch = await PreMatch.findOne({
			api_id,
		}).populate('p1')
		
		// .populate('tournament').populate('court').populate('p1').populate('p2')

		return existingPreMatch
	} catch (err) {
		throw createError(err, 'get prematch', { api_id, collection: 'prematch' })
	}
}

const getTeam = async (api_id: number): Promise<ITeam & Document | null> => {
	try {
		const existingTeam = await Team.findOne({
			api_id,
		})

		return existingTeam
	} catch (err) {
		throw createError(err, 'get team', { api_id, collection: 'team' })
	}
}

const getTournament = async (api_id: number): Promise<ITournament & Document | null> => {
	try {
		const existingTorunament = await Tournament.findOne({
			api_id,
		})

		return existingTorunament
	} catch (err) {
		throw createError(err, 'get tournament', { api_id, collection: 'tournament' })
	}
}

const getRequestsInfo = async (formattedDate: string): Promise<IRequestsInfo & Document | null> => {
	try {

		const existingRequestInfoDay = await RequestsInfo.findOne({
			date: formattedDate,
		})

		return existingRequestInfoDay
	} catch (err) {
		throw createError(err, 'get requestInfo', { collection: 'requestsInfo' })
	}
}

const GET = {
	getPlayer,
	getTeam,
	getCourt,
	getPreMatch,
	getTournament,
	getRequestsInfo,
}

export default GET