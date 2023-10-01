import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import RequestsInfo from '@database/models/requestsInfo.model'
import Tournament from '@database/models/tournament.model'
import { hours } from '@constants/data'
import type { Document } from 'mongoose'
import type { ICourt, IMatch, IPlayer, IPreMatch, IRequestsInfo, ITournament } from 'types/schemas'
import logger from '@config/logger'
import Match from '@database/models/match.model'

const saveNewCourt = async (courtData: ICourt): Promise<ICourt & Document> => {
	try {
		const newCourt = new Court(courtData)
		const savedCourt = await newCourt.save()

		return savedCourt
	} catch (err) {
		console.log(err)
		logger.error("Error when saving a new court")
		throw new Error("Error when saving a new court")
	}
}

const saveNewPlayer = async (playerData: IPlayer): Promise<IPlayer & Document> => {
	try {
		const newPlayer = new Player(playerData)

		const savedPlayer = await newPlayer.save()

		return savedPlayer
	} catch (err) {
		console.log(err)
		logger.error("Error when saving a new player")
		throw new Error("Error when saving a new player")
	}
}

const saveNewTournament = async (tournamentData: ITournament): Promise<ITournament & Document> => {
	try {
		const newTournament = new Tournament(tournamentData)

		const savedTournament = await newTournament.save()
		// logger.info(`New tournament saved - NAME: ${savedTournament.name} - ID: ${savedTournament.api_id}`)

		return savedTournament
	} catch (err: any) {
		console.log(err)
		logger.error("Error when saving a new tournament")
		throw new Error("Error when saving a new tournament")
	}
}

const saveNewPreMatch = async (matchData: IPreMatch): Promise<IPreMatch & Document> => {
	try {
		const newPreMatch = new PreMatch(matchData)

		const savedPreMatch = await newPreMatch.save()

		return savedPreMatch
	} catch (err) {
		console.log(err)
		logger.error("Error when saving a new pre match")
		throw new Error("Error when saving a new pre match")
	}
}

const saveNewEndedMatch = async (matchData: IMatch): Promise<IMatch & Document> => {
	try {
		const newEndedMatch = new Match(matchData)

		const savedEndedMatch = await newEndedMatch.save()

		return savedEndedMatch
	} catch (err) {
		console.log(err)
		logger.error("Error when saving a new ended match")
		throw new Error("Error when saving a new ended match")
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
		console.log(err)
		logger.error("Error when saving a new requests info")
		throw new Error("Error when saving a new requests info")
	}
}

const SAVE = {
	saveNewCourt,
	saveNewRequestInfo,
	saveNewPlayer,
	saveNewTournament,
	saveNewPreMatch,
	saveNewEndedMatch
}

export default SAVE
