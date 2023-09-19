import logger from '@config/logger'
import Court from '@database/models/court.model'
import { TempPlayer } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import RequestsInfo from '@database/models/requestsInfo.model'
import { TempTeam } from '@database/models/team.model'
import Tournament from '@database/models/tournament.model'
import { hours } from 'constants/data'
import type { Document } from 'mongoose'
import type { ICourt, IPlayer, IPreMatch, IRequestsInfo, ITeam, ITournament } from 'types/schemas'
import { createError } from 'utils/createError'

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

const saveNewTempPlayer = async (playerData: IPlayer): Promise<IPlayer & Document> => {
	try {
		const newTempPlayer = new TempPlayer(playerData)
		const savedTempPlayer = await newTempPlayer.save()

		logger.info(`New temporal player saved - NAME: ${savedTempPlayer.name} - ID: ${savedTempPlayer.api_id}`)
		return savedTempPlayer
	} catch (err) {
		throw createError(err, 'save new tempPlayer', { api_id: playerData.api_id, collection: 'tempPlayer' })
	}
}

const saveNewTempTeam = async (teamData: any): Promise<ITeam & Document> => {
	try {
		const newTempTeam = new TempTeam(teamData)
		const savedTempTeam = await newTempTeam.save()
		logger.info(`New temporal team saved - ID: ${savedTempTeam.api_id}`)

		return savedTempTeam
	} catch (err) {
		throw createError(err, 'save new tempTeam', { api_id: teamData.api_id, collection: 'tempTeam' })
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
		const newPreMatch = new PreMatch(matchData)

		const savedPreMatch = await newPreMatch.save()

		logger.info(
			`New pre match saved - ID: ${savedPreMatch.api_id} - P1: ${matchData.p1.api_id} - - P2: ${matchData.p2.api_id}`,
		)
		return savedPreMatch
	} catch (err) {
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
	saveNewTempPlayer,
	saveNewTempTeam,
	saveNewTournament,
	saveNewPreMatch
}

export default SAVE
