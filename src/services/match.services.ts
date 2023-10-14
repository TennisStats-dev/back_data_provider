import config from '@config/index'
import logger from '@config/logger'
import { matchRound, matchStatus } from '@constants/data'
import type {
	ICourt,
	IDoublesPlayer,
	IGameStats,
	IMatch,
	IMatchStats,
	IPlayer,
	IPreMatch,
	IPreOdds,
	ISetStats,
	ITournament,
	Status,
	Type,
} from 'types/types'
import type { UpcomingMatches } from '@API/types/upcomingMatches'
import { preMatchOddsHandler } from './odds.services'
import { msToDateTime } from '@utils/msToDateTime'
import type { MatchView } from '@API/types/MatchView'
import { courtHanlder } from './court.services'
import { getTournamentBestOfsets, getTournamentGround } from './tournament.services'
import { countriesArray } from '@constants/countries'
import type { EndedMatches } from '@API/types/endedMatches'
import { saveResultIssue } from './issues.services'

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
		logger.warn(`It was not possible to identify match ROUND (input: ${roundInput}) for match with id: ${api_id}`)
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

export const getUpcomingMatchesFromAPI = async (): Promise<UpcomingMatches[]> => {
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

export const updateMatchData = async (
	matchDB: IPreMatch,
	eventViewAPIResponse: MatchView,
): Promise<void> => {
	if(matchDB.api_id === 7326830) {
		console.log('-----------------------------------------------')
		console.log('DB MATCH BEFORE UPDATE')
		console.log(matchDB)
	}

	if (matchDB.bet365_id === undefined && eventViewAPIResponse.bet365_id !== undefined) {
		matchDB.bet365_id = Number(eventViewAPIResponse.bet365_id)
	}

	const preOdds = await preMatchOddsHandler(Number(eventViewAPIResponse.bet365_id), matchDB.api_id)
	if (preOdds !== null) {
		matchDB.pre_odds = preOdds
	}

	if (matchDB.status !== Number(eventViewAPIResponse.time_status)) {
		matchDB.status = getMatchStatus(Number(eventViewAPIResponse.time_status), matchDB.api_id)
	}

	if (matchDB.est_time !== msToDateTime(eventViewAPIResponse.time)) {
		matchDB.est_time = msToDateTime(eventViewAPIResponse.time)
	}

	if (eventViewAPIResponse.extra !== undefined) {
		if (matchDB.round === undefined && eventViewAPIResponse.extra?.round !== undefined) {
			matchDB.round = getMatchRound(eventViewAPIResponse.extra.round, Number(eventViewAPIResponse.id))
		}

		if (matchDB.court === undefined && eventViewAPIResponse.extra?.stadium_data !== undefined) {
			const court: ICourt | null = await courtHanlder(eventViewAPIResponse?.extra?.stadium_data, eventViewAPIResponse.id)
			if (court !== null) {
				matchDB.court = court
			}
		}

		const tournamentDB = await config.database.services.getters.getTournament(matchDB.tournament.api_id)

		if (tournamentDB !== null) {
			if (tournamentDB.best_of_sets === undefined && eventViewAPIResponse.extra?.bestofsets !== undefined) {
				tournamentDB.best_of_sets = getTournamentBestOfsets(
					eventViewAPIResponse.extra.bestofsets,
					tournamentDB.name,
					tournamentDB.api_id,
					matchDB.api_id,
				)
			}
			if (tournamentDB.ground === undefined && eventViewAPIResponse.extra?.ground !== undefined) {
				tournamentDB.ground = getTournamentGround(
					eventViewAPIResponse.extra.ground,
					tournamentDB.name,
					tournamentDB.api_id,
					matchDB.api_id,
				)
			}
			if (
				tournamentDB.cc === undefined &&
				eventViewAPIResponse.extra?.stadium_data?.country !== undefined &&
				eventViewAPIResponse.extra?.stadium_data?.country !== null
			) {
				const countryName = countriesArray.find(
					(country) => country.name === eventViewAPIResponse.extra.stadium_data.country,
				)
				if (countryName === undefined) {
					logger.warn(
						`There is a tournament (id: ${tournamentDB.api_id}, name: ${tournamentDB.name}) with a not stored country : ${eventViewAPIResponse.extra.stadium_data.country} - match id: ${matchDB.api_id}`,
					)
				} else {
					tournamentDB.cc = countryName.cc
				}
			}

			await tournamentDB.save()
			
			const updatedMatch = await tournamentDB.save()
			if(matchDB.api_id === 7326830) {
				console.log('-----------------------------------------------')
				console.log('DB MATCH AFTER UPDATE')
				console.log(updatedMatch)
			}
		}
	}
}

export const getformattedResult = async (
	resultData: string,
	home: IPlayer | IDoublesPlayer,
	away: IPlayer | IDoublesPlayer,
	status: string,
	matchId: number,
	tournamentName: string
): Promise<IMatchStats['result']> => {
	if (Number(status) === config.api.constants.matchStatus['5']) {
		return 'cancelled'
	} else if (
		(Number(status) === config.api.constants.matchStatus['3'] || Number(status) === config.api.constants.matchStatus['4'] ||
			Number(status) === config.api.constants.matchStatus['6'] || Number(status) === config.api.constants.matchStatus['9'] ) &&
		resultData === null
	) {
		const details = `API ISSUE: Result (ss) is NULL for match ${matchId} - tournament: ${tournamentName} with status: ${status} and players - id: ${home.api_id} name:  ${home.name} vs id: ${away.api_id} name:  ${away.name}`
		await saveResultIssue(details, status, matchId, home, away)
		return 'Not updated'
	} else if (resultData === 'home' || resultData === 'away') {
		return resultData
	} else {
		const arrayOfSets = resultData.split(',')
		let resultIsCorrect = true

		if (arrayOfSets.length < 2) {
			resultIsCorrect = false
		}

		arrayOfSets.forEach((set, index) => {
			const arrayOfGames = set.split('-')
			if (index !== arrayOfSets.length - 1) {
				if (Number(arrayOfGames[0]) < 6 && Number(arrayOfGames[1]) < 6) {
					resultIsCorrect = false
				}
			} else {
				if (Number(arrayOfGames[0]) + Number(arrayOfGames[1]) > 1) {
					if (Number(arrayOfGames[0]) < 6 && Number(arrayOfGames[1]) < 6) {
						resultIsCorrect = false
					}
				}
			}
		})

		if (resultIsCorrect) {
			return arrayOfSets
		} else {
			const details = `API ISSUE: Result (ss) is not valid: ${resultData}, for match ${matchId} - tournament: ${tournamentName} with status: ${status} and players - id: ${home.api_id} name:  ${home.name} vs id: ${away.api_id} name:  ${away.name}`
			await saveResultIssue(details, status, matchId, home, away)
			return 'Not updated'
		}
	}
}

export const getMatchWinner = (
	formattedResult: IMatchStats['result'],
	home: IPlayer | IDoublesPlayer,
	away: IPlayer | IDoublesPlayer,
	matchId: number,
): IPlayer | IDoublesPlayer | undefined => {
	if (Array.isArray(formattedResult)) {
		const lastSetResult = formattedResult[formattedResult.length - 1].split('-')
		if (Number(lastSetResult[0]) > Number(lastSetResult[1])) {
			return home
		} else {
			return away
		}
	} else if (formattedResult === 'cancelled') {
		return undefined
	} else if (formattedResult === 'home') {
		return home
	} else if (formattedResult === 'away') {
		return away
	} else if (formattedResult === 'Not updated') {
		return undefined
	}

	logger.warn(`It was not possilbe to identify a result format and set a winner for match ${matchId}`)
	return undefined
}

export const createNewEndedMatchObject = async (
	status: string,
	preMatchData: IPreMatch,
	resultData: string,
	acesData: string[] | undefined,
	dfData: string[] | undefined,
	win_1st_serveData: string[] | undefined,
	bpData: string[] | undefined,
	setStatsData: Array<{ id: string; text: string }> | undefined,
): Promise<IMatch> => {
	const formattedResult = await getformattedResult(
		resultData,
		preMatchData.home,
		preMatchData.away,
		status,
		preMatchData.api_id,
		preMatchData.tournament.name
	)
	const winner = getMatchWinner(formattedResult, preMatchData.home, preMatchData.away, preMatchData.api_id)

	const endedMatchData: IMatch = Object.assign(
		{
			match_stats: {
				result: formattedResult,
				winner,
			},
		},
		preMatchData,
	)

	if (acesData !== undefined) {
		endedMatchData.match_stats.aces = acesData.map((ace) => Number(ace)) as IMatchStats['aces']
	}

	if (dfData !== undefined) {
		endedMatchData.match_stats.df = dfData.map((df) => Number(df)) as IMatchStats['df']
	}
	if (win_1st_serveData !== undefined) {
		endedMatchData.match_stats.win_1st_serve = win_1st_serveData.map((perCent) =>
			Number(perCent),
		) as IMatchStats['win_1st_serve']
	}

	if (bpData !== undefined) {
		endedMatchData.match_stats.bp = bpData.map((perCent) => Number(perCent)) as IMatchStats['bp']
	}

	const setStats: ISetStats[] = []

	if (Array.isArray(formattedResult) && setStatsData !== undefined && setStatsData.length > 0) {
		const totalGamesPerSet = formattedResult.map((stringRes) => {
			return stringRes
				.split('-')
				.map((stringRes) => Number(stringRes))
				.reduce((a, b): number => a + b)
		})

		totalGamesPerSet.forEach((gamesSet, index) => {
			const gameStats = setStatsData.splice(0, gamesSet).map((game): IGameStats => {
				return {
					summary: game.text,
				}
			})

			setStats.push({
				number: index + 1,
				games_stats: gameStats,
			})
		})

		endedMatchData.sets_stats = setStats
	}

	return endedMatchData
}

export const getAllEndedMatchesFromAPI = async (): Promise<EndedMatches[]> => {
	const allEndedMatches: EndedMatches[] = []
	let page = 1

	const EndedMatchesApiResponse = await config.api.services.getEndedMatches(page)
	allEndedMatches.push(...EndedMatchesApiResponse.results)

	do {
		page += 1
		console.log(page)
		const apiResponse = await config.api.services.getEndedMatches(page)
		allEndedMatches.push(...apiResponse.results)
	} while (page < 100)

	return allEndedMatches
}
