import config from '@config/index'
import logger from '@config/logger'
import { matchRound, matchStatus } from '@constants/data'
import type { ICourt, IDoublesPlayer, IPlayer, IPreMatch, IPreOdds, ITournament, Status, Type } from 'types/schemas'
import type { UpcomingMatches } from '@API/types/upcomingMatches'

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

export const getMatchRound = (roundInput: string | undefined, api_id: number): IPreMatch['round'] => {
	if (roundInput === undefined) {
		return undefined
	}

	const round = matchRound[Number(roundInput)]

	if (round === undefined) {
		logger.warn(`It was not possible to identify match ROUND for match with id: ${api_id}`)
		return undefined
	} else {
		return round
	}
}

export const createNewPreMatchObject = (
	api_id: number,
	bet365_id: number,
	sport_id: number,
	type: Type,
	roundInput: string | undefined,
	tournament: ITournament,
	court: ICourt | null,
	home: IPlayer | IDoublesPlayer,
	away: IPlayer | IDoublesPlayer,
	statusInput: string,
	est_time: Date,
	pre_odds: IPreOdds | null,
): IPreMatch => {
	const round = getMatchRound(roundInput, api_id)
	const status = getMatchStatus(Number(statusInput), api_id)

	const matchData: IPreMatch = {
		api_id,
		sport_id,
		round,
		type,
		tournament,
		home,
		away,
		status,
		est_time,
	}

	if (!isNaN(bet365_id) && bet365_id !== null) {
		matchData.bet365_id = bet365_id
	}

	if (court !== null) {
		matchData.court = court
	}

	if (pre_odds !== null) {

		matchData.pre_odds = pre_odds
	}

	return matchData
}

export const getUpcomingMatchesFromAPI = async ():Promise<UpcomingMatches[]>  => {
	const allUpcomingMatches: UpcomingMatches[] = []
		let page = 1

		const upcomingMatchesApiResponse = await config.api.services.getUpcomingMatches(page)
		allUpcomingMatches.push(...upcomingMatchesApiResponse.results)

		do {
			page += 1
			const apiResponse = await config.api.services.getUpcomingMatches(page)
			allUpcomingMatches.push(...apiResponse.results)
		} while (allUpcomingMatches.length < upcomingMatchesApiResponse.pager.total)

		return allUpcomingMatches
}