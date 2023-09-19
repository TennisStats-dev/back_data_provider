import logger from '@config/logger'
import { matchRound, matchStatus } from 'constants/data'
import type { ICourt, IPlayer, IPreMatch, ITeam, ITournament, Status } from 'types/schemas'

export const checkIfIsTennisMatch = (sportId: number): boolean => {
	return sportId === 13
}

export const getMatchStatus = (statusInput: number, api_id: number): Status => {
	const status = matchStatus[statusInput]

	if (status === undefined) {
		logger.warn(`It was not possible to identify match STATUS for match with id: ${api_id}`)
		return matchStatus[0]
	} else {
		return status
	}
}

export const getMatchRound = (roundInput: number, api_id: number): IPreMatch['round'] => {
	const round = matchRound[roundInput]

	console.log(round)

	if (round === undefined) {
		logger.warn(`It was not possible to identify match ROUND for match with id: ${api_id}`)
		return 'unknown'
	} else {
		return round
	}
}

export const createNewPreMatchObject = (
	api_id: number,
	bet365_id: number,
	sport_id: number,
	roundInput: string | undefined,
	tournament: ITournament,
	court: ICourt | null,
	p1: IPlayer | ITeam,
	p2: IPlayer | ITeam,
	statusInput: string,
	est_time: Date,
): IPreMatch => {
	const round = getMatchRound(Number(roundInput), api_id)
	const status = getMatchStatus(Number(statusInput), api_id)

	const matchData: IPreMatch = {
		api_id,
		sport_id,
		round,
		tournament,
		p1,
		p2,
		status,
		est_time,
	}

	if (!isNaN(bet365_id) && bet365_id !== null) {
		matchData.bet365_id = bet365_id
	}

	if (court !== null) {
		matchData.court = court
	}

	return matchData
}
