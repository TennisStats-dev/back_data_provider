import logger from '@config/logger'
import Court from '@database/models/court.model'
import Match from '@database/models/match.model'
import MatchIssue from '@database/models/statusIssue.model'
import { Player } from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import ResultIssue from '@database/models/resultIssue.model'
import Tournament from '@database/models/tournament.model'
import type { Document } from 'mongoose'
import type { ICourt, IMatch, IPlayer, IPreMatch, IResultIssue, IStatusIssue, ITournament } from 'types/types'

const getCourt = async (api_id: number): Promise<(ICourt & Document) | null> => {
	try {
		const existingCourt = await Court.findOne({
			api_id,
		})

		return existingCourt
	} catch (err) {
		console.log(err)
		logger.error('Error getting a court')
		throw new Error('Error getting a court')
	}
}

const getPlayer = async (api_id: number): Promise<(IPlayer & Document) | null> => {
	try {
		const existingPlayer = await Player.findOne({
			api_id,
		})

		return existingPlayer
	} catch (err) {
		console.log(err)
		logger.error('Error getting a player')
		throw new Error('Error getting a player')
	}
}

const getPreMatch = async (api_id: number): Promise<(IPreMatch & Document) | null> => {
	try {
		const existingPopulatedMatch = await PreMatch.findOne({
			api_id,
		})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting a pre match')
		throw new Error('Error getting a pre match')
	}
}
const getAllPreMatches = async (): Promise<Array<IPreMatch & Document> | null> => {
	try {
		const existingPopulatedMatch = await PreMatch.find()
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting all pre matches')
		throw new Error('Error getting all pre matches')
	}
}

const getEndedMatch = async (api_id: number): Promise<(IMatch & Document) | null> => {
	try {
		const existingPopulatedMatch = await Match.findOne({
			api_id,
		})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting an ended match')
		throw new Error('Error getting an ended match')
	}
}

const getAllPlayerEndedMatchesByApi_id = async (id: number): Promise<Array<IPreMatch & Document> | null> => {
	try {
		const playerObject = await Player.findOne({api_id: id})

		if (playerObject !== null) {
			const existingPopulatedMatch = await Match.find({ $or: [{ home: playerObject._id }, { away: playerObject._id }] })

			return existingPopulatedMatch
		}

		else return null

	} catch (err) {
		console.log(err)
		logger.error('Error getting all player ended matches')
		throw new Error('Error getting all player ended matches')
	}
}
const getAllPlayerEndedMatchesById = async (id: string): Promise<Array<IPreMatch & Document> | null> => {
	try {

			const existingPopulatedMatch = await Match.find({ $or: [{ home: id }, { away: id }] })

			return existingPopulatedMatch

	} catch (err) {
		console.log(err)
		logger.error('Error getting all player ended matches')
		throw new Error('Error getting all player ended matches')
	}
}

const getAllEndedMatches = async (): Promise<Array<IMatch & Document> | null> => {
	try {
		const existingPopulatedMatch = await Match.find()
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting all ended matches')
		throw new Error('Error getting all ended matches')
	}
}

const getTournament = async (api_id: number): Promise<(ITournament & Document) | null> => {
	try {
		const existingTournament = await Tournament.findOne({
			api_id,
		})

		return existingTournament
	} catch (err) {
		console.log(err)
		logger.error('Error getting a tournament')
		throw new Error('Error getting a tournament')
	}
}
const getAllTournaments = async (): Promise<Array<ITournament & Document> | null> => {
	try {
		const existingTournaments = await Tournament.find()

		return existingTournaments
	} catch (err) {
		console.log(err)
		logger.error('Error getting all tournaments')
		throw new Error('Error getting all tournaments')
	}
}

const getEndedMatchesResultIssue = async (matchId: number): Promise<(IResultIssue & Document) | null> => {
	try {
		const existingEndedMatchesIssue = await ResultIssue.findOne({
			matchId,
		})

		return existingEndedMatchesIssue
	} catch (err) {
		console.log(err)
		logger.error('Error getting one ended matches issues')
		throw new Error('Error getting one ended matches issues')
	}
}

const getEndedMatchesStatusIssue = async (matchId: number): Promise<(IStatusIssue & Document) | null> => {
	try {
		const existingEndedMatchesIssue = await MatchIssue.findOne({
			matchId,
		})

		return existingEndedMatchesIssue
	} catch (err) {
		console.log(err)
		logger.error('Error getting one ended matches issues')
		throw new Error('Error getting one ended matches issues')
	}
}

const getAllEndedMatchesIssues = async (): Promise<Array<IResultIssue & Document> | null> => {
	try {
		const existingEndedMatchesIssues = await ResultIssue.find()

		return existingEndedMatchesIssues
	} catch (err) {
		console.log(err)
		logger.error('Error getting all ended matches issues')
		throw new Error('Error getting all ended matches issues')
	}
}

const GET = {
	getPlayer,
	getCourt,
	getPreMatch,
	getAllPreMatches,
	getEndedMatch,
	getAllEndedMatches,
	getAllPlayerEndedMatchesByApi_id,
	getAllPlayerEndedMatchesById,
	getTournament,
	getAllTournaments,
	getEndedMatchesResultIssue,
	getAllEndedMatchesIssues,
	getEndedMatchesStatusIssue,
}

export default GET
