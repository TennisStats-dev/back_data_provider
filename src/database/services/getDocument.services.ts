import logger from '@config/logger'
import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import RequestsInfo from '@database/models/requestsInfo.model'
import Tournament from '@database/models/tournament.model'
import type { Document } from 'mongoose'
import type { ICourt, IPlayer, IPreMatch, IRequestsInfo, ITournament } from 'types/schemas'

const getCourt = async (api_id: number): Promise<ICourt & Document | null> => {
	try {
		const existingCourt = await Court.findOne({
			api_id,
		})

		return existingCourt
	} catch (err) {
		console.log(err)
		logger.error("Error getting a court")
		throw new Error("Error getting a court")
	}
}

const getPlayer = async (api_id: number): Promise<IPlayer & Document | null> => {
	try {
		const existingPlayer = await Player.findOne({
			api_id,
		})

		return existingPlayer
	} catch (err) {
		console.log(err)
		logger.error("Error getting a player")
		throw new Error("Error getting a player")
	}
}

const getPreMatch = async (api_id: number): Promise<IPreMatch & Document | null> => {
	try {
		const existingPopulatedMatch = await PreMatch.findOne({
			api_id,
		}).populate('tournament').populate('court').populate('home').populate('away')
		
		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error("Error getting a pre match")
		throw new Error("Error getting a pre match")
	}
}
const getAllPreMatches = async (): Promise<Array<IPreMatch & Document | null>> => {
	try {
		const existingPopulatedMatch = await PreMatch.find().populate('tournament').populate('court').populate('home').populate('away')
		
		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error("Error getting a pre match")
		throw new Error("Error getting a pre match")
	}
}



const getTournament = async (api_id: number): Promise<ITournament & Document | null> => {
	try {
		const existingTorunament = await Tournament.findOne({
			api_id,
		})

		return existingTorunament
	} catch (err) {
		console.log(err)
		logger.error("Error getting a tournament")
		throw new Error("Error getting a tournament")
	}
}

const getRequestsInfo = async (formattedDate: string): Promise<IRequestsInfo & Document | null> => {
	try {

		const existingRequestInfoDay = await RequestsInfo.findOne({
			date: formattedDate,
		})

		return existingRequestInfoDay
	} catch (err) {
		console.log(err)
		logger.error("Error getting the requests info")
		throw new Error("Error getting the requests info")
	}
}

const GET = {
	getPlayer,
	getCourt,
	getPreMatch,
	getAllPreMatches,
	getTournament,
	getRequestsInfo,
}

export default GET