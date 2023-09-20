import config from '@config/index'
import logger from '@config/logger'
import type { EventOdds } from '@API/types/eventOdds'
import { matchRound, matchStatus } from '@constants/data'
import type { ICourt, IDoublesPlayer, IPlayer, IPreMatch, IPreOdds, ITournament, Status, Type } from 'types/schemas'

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

export const getMatchPreOdds = (eventOddsInput: EventOdds): IPreOdds | null => {
	if (eventOddsInput.stats.matching_dir !== undefined) {
		const WinnerObject = eventOddsInput.odds[config.api.constants.oddsMarketsRef.winner]

		const firstSetWinnerObject = eventOddsInput.odds[config.api.constants.oddsMarketsRef.firstSetWinner]

		const preMatchOddsObject: IPreOdds = {
			first: {
				win: [Number(WinnerObject.at(-1)?.home_od), Number(WinnerObject.at(-1)?.away_od)],
				time: new Date(Number(WinnerObject[WinnerObject.length - 1].add_time) * 1000),
			},
			last: {
				win: [Number(WinnerObject[0].home_od), Number(WinnerObject[0].away_od)],
				update: new Date(Number(eventOddsInput.stats.odds_update['13_1']) * 1000),
			},
		}

		if (eventOddsInput.odds[config.api.constants.oddsMarketsRef.firstSetWinner].length > 0) {
			preMatchOddsObject.first.win_1st_set = [
				Number(firstSetWinnerObject.at(-1)?.home_od),
				Number(firstSetWinnerObject.at(-1)?.away_od),
			]

			preMatchOddsObject.last.win_1st_set = [
				Number(firstSetWinnerObject[0].home_od),
				Number(firstSetWinnerObject[0].away_od),
			]
		}

		return preMatchOddsObject
	}
	return null
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
