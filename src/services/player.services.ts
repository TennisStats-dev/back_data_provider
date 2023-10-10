import config from '@config/index'
import type {
	Gender,
	ICourt,
	IDoublesPlayer,
	IMatchPlayers,
	IMatchPlayersObject,
	IPlayer,
	IPreOdds,
	ITournament,
	Type,
} from 'types/types'
import { checkIfArrayIncludesSubstring } from '@utils/checkArrayIncludesSubstring'
import { countriesCCArray } from '@constants/countries'
import logger from '@config/logger'
import { gender, type } from '@constants/data'
import type { EndedMatches } from '@API/types/endedMatches'
import { tournamentHandler } from './tournament.services'
import { courtHanlder } from './court.services'
import { preMatchOddsHandler } from './odds.services'
import { createNewEndedMatchObject, createNewPreMatchObject } from './match.services'
import { msToDateTime } from '@utils/msToDateTime'

const checkIfIsPlayer = (playerName: string): boolean => {
	return !checkIfArrayIncludesSubstring(config.api.formats.Team, playerName)
}

export const createNewPlayerObject = (
	api_id: number,
	name: string,
	gender: Gender,
	cc: string | null,
	birth?: Date,
): IPlayer => {
	const playerData: IPlayer = {
		name,
		api_id,
		gender,
	}

	if (birth instanceof Date) {
		playerData.birth = birth
	}

	if (cc !== null && cc !== '' && !countriesCCArray.includes(cc)) {
		logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
		playerData.cc = cc
	} else if (cc !== null && countriesCCArray.includes(cc)) {
		playerData.cc = cc
	}

	return playerData
}

const createNewDoublesPlayerObject = (
	api_id: number,
	name: string,
	gender: Gender,
	cc: string | undefined,
	p1: IPlayer,
	p2: IPlayer | null,
	birth?: Date,
): IDoublesPlayer => {
	const doublesPlayerData: IDoublesPlayer = {
		api_id,
		name,
		gender,
		team: {
			p1,
		},
	}

	if (birth instanceof Date) {
		doublesPlayerData.birth = birth
	}

	if (cc !== undefined && cc !== '' && !countriesCCArray.includes(cc)) {
		logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
		doublesPlayerData.cc = cc
	} else if (cc !== undefined && countriesCCArray.includes(cc)) {
		doublesPlayerData.cc = cc
	}

	if (p2 !== null) {
		doublesPlayerData.team.p2 = p2
	}

	return doublesPlayerData
}

const saveDoublesPlayers = async (playersArray: IPlayer[], matchGender: Gender): Promise<IMatchPlayersObject> => {
	const savedPlayers: IMatchPlayersObject = {
		home: undefined,
		away: undefined,
	}

	const teamsPromises = playersArray.map(async (teamData, i) => {
		const teamDB = await config.database.services.getters.getPlayer(Number(teamData.api_id))

		if (teamDB !== null) {
			if (i === 0) {
				savedPlayers.home = teamDB
			} else {
				savedPlayers.away = teamDB
			}
		} else {
			const teamPlayers: IPlayer[] = []

			const team1Data = await config.api.services.getTeamMembers(teamData.api_id)

			const teamPlayersPromises = team1Data.map(async (player, j): Promise<void> => {
				if (player !== null) {
					const playerDB = await config.database.services.getters.getPlayer(Number(player.id))

					if (playerDB != null) {
						teamPlayers[j] = playerDB
					} else {
						const playerObject = createNewPlayerObject(Number(player.id), player.name, matchGender, player.cc)
						const savedPlayer = await config.database.services.savers.saveNewPlayer(playerObject)

						teamPlayers[j] = savedPlayer
					}
				}
			})

			await Promise.allSettled(teamPlayersPromises)

			const doublesPlayerObject: IDoublesPlayer = createNewDoublesPlayerObject(
				teamData.api_id,
				teamData.name,
				teamData.gender,
				teamData.cc,
				teamPlayers[0],
				teamPlayers[1],
			)

			const savedDoublesPlayer = await config.database.services.savers.saveNewPlayer(doublesPlayerObject)

			if (i === 0) {
				savedPlayers.home = savedDoublesPlayer
			} else {
				savedPlayers.away = savedDoublesPlayer
			}
		}
	})

	await Promise.allSettled(teamsPromises)

	return savedPlayers
}

const savePlayer = async (playersArray: IPlayer[]): Promise<IMatchPlayersObject> => {
	const savedPlayers: IMatchPlayersObject = {
		home: undefined,
		away: undefined,
	}

	const playersPromises = playersArray.map(async (player, j): Promise<void> => {
		const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

		if (playerDB != null) {
			if (j === 0) {
				savedPlayers.home = playerDB
			} else {
				savedPlayers.away = playerDB
			}
		} else {
			const savedPlayer = await config.database.services.savers.saveNewPlayer(playersArray[j])

			if (j === 0) {
				savedPlayers.home = savedPlayer
			} else {
				savedPlayers.away = savedPlayer
			}
		}
	})

	await Promise.allSettled(playersPromises)

	return savedPlayers
}

export const playerHandler = async (
	playersArray: IPlayer[],
	tournamentType: Type,
	matchGender: Gender,
): Promise<IMatchPlayers> => {
	let savedPlayers: IMatchPlayersObject = {
		home: undefined,
		away: undefined,
	}

	if (tournamentType === type.menDoubles || tournamentType === type.womenDoubles) {
		savedPlayers = await saveDoublesPlayers(playersArray, matchGender)
	} else if (tournamentType === type.menMixed) {
		if (checkIfIsPlayer(playersArray[0].name)) {
			savedPlayers = await savePlayer(playersArray)
		} else {
			savedPlayers = await saveDoublesPlayers(playersArray, matchGender)
		}
	} else {
		savedPlayers = await savePlayer(playersArray)
	}

	if (savedPlayers.home !== undefined && savedPlayers.away !== undefined) {
		return {
			home: savedPlayers.home,
			away: savedPlayers.away,
		}
	} else {
		throw new Error(
			`PROCESS: Player handler | INFO: Player handler missed and at least one player is undefined | DETAILS: home: ${playersArray[0].api_id} - away: ${playersArray[1].api_id}`,
		)
	}
}

export const getAllPlayerEndedMatchesFromAPI = async (api_id: number): Promise<EndedMatches[]> => {
	const playerEndedMatches: EndedMatches[] = []
	let page = 1

	const playerEndedMatchesApiResponse = await config.api.services.getPlayerEndedMatches(page, api_id)
	playerEndedMatches.push(...playerEndedMatchesApiResponse.results)

	do {
		page += 1
		const apiResponse = await config.api.services.getPlayerEndedMatches(page, api_id)
		playerEndedMatches.push(...apiResponse.results)
	} while (playerEndedMatches.length < playerEndedMatchesApiResponse.pager.total)

	return playerEndedMatches
}

export const saveAllPlayerMatches = async (api_id: number): Promise<void> => {
	try {
		const playerData = await config.database.services.getters.getPlayer(api_id)

		if (playerData === null) {
			logger.warn(`Player not found on DB when trying to save all them history matches - player id: ${api_id} `)
			return
		}

		logger.info(`Saving ended matches for player: id: ${api_id} name: ${playerData.name}`)

		const playerId = playerData._id

		let newPlayerEndedMatchesStored = 0
		let playerEndedMatchesalreadyStored = 0
		let notEventviewForEndedMatch = 0
		let toBeFixed = 0
		let notStarted = 0
		const playerEndedMatchesAPI = await getAllPlayerEndedMatchesFromAPI(api_id)

		if (playerEndedMatchesAPI.length === 0) {
			return
		}
		const endedMatchesAPIApiIds = playerEndedMatchesAPI.map((match) => {
			return Number(match.id)
		})

		const playerEndedMatchesDB = await config.database.services.getters.getAllPlayerEndedMatchesById(playerId)
		let endedMatchesDBApiIds: number[] | undefined


		if (playerEndedMatchesDB !== null) {
			endedMatchesDBApiIds = playerEndedMatchesDB.map((match) => {
				return match.api_id
			})
			playerEndedMatchesalreadyStored = endedMatchesDBApiIds.length
		}

		const playerEndedMatchesNotStored = endedMatchesAPIApiIds.filter((apiId) => {
			if (endedMatchesDBApiIds === undefined) {
				return apiId
			} else {
				return !(endedMatchesDBApiIds?.includes(apiId) ?? false)
			}
		})



		for (const apiId of playerEndedMatchesNotStored) {

			const eventViewAPIResponse = await config.api.services.getEventView(apiId)

			if (eventViewAPIResponse === undefined) {
				const details = `!!! The match with the id ${api_id},  doesn't have an event view !!!`
				logger.warn(details)

				notEventviewForEndedMatch++

				continue
			}

			if (Number(eventViewAPIResponse.time_status) === config.api.constants.matchStatus['2']) {
				logger.info(`Ther is a match of the player history to be fixed (status 2)`)
				
				toBeFixed++

				continue
			}

			if (Number(eventViewAPIResponse.time_status) === config.api.constants.matchStatus['0']) {
				logger.info(`Ther is a match of the player history not started (status 0)`)
				
				notStarted++

				continue
			}

			const tournament: ITournament = await tournamentHandler(
				Number(eventViewAPIResponse.id),
				Number(eventViewAPIResponse.league.id),
				eventViewAPIResponse.league.name,
				eventViewAPIResponse.league.cc,
				eventViewAPIResponse,
			)

			const matchGender =
				tournament.type === type.women || tournament.type === type.womenDoubles ? gender.female : gender.male

			const playersArray: IPlayer[] = [
				createNewPlayerObject(
					Number(eventViewAPIResponse.home.id),
					eventViewAPIResponse.home.name,
					matchGender,
					eventViewAPIResponse.home.cc,
				),
				createNewPlayerObject(
					Number(eventViewAPIResponse.away.id),
					eventViewAPIResponse.away.name,
					matchGender,
					eventViewAPIResponse.away.cc,
				),
			]

			const { home, away } = await playerHandler(playersArray, tournament.type, matchGender)

			const court: ICourt | null = await courtHanlder(eventViewAPIResponse?.extra?.stadium_data, eventViewAPIResponse.id)

			const pre_odds: IPreOdds | null = await preMatchOddsHandler(
				Number(eventViewAPIResponse.bet365_id),
				Number(eventViewAPIResponse.id),
			)

			if (home !== null && away !== null) {
				const preMatchData = createNewPreMatchObject(
					Number(eventViewAPIResponse.id),
					Number(eventViewAPIResponse.bet365_id),
					Number(eventViewAPIResponse.sport_id),
					tournament.type,
					eventViewAPIResponse.extra?.round,
					tournament,
					court,
					home,
					away,
					eventViewAPIResponse.time_status,
					msToDateTime(eventViewAPIResponse.time),
					pre_odds,
				)

				const { ss, stats, events, time_status } = eventViewAPIResponse

				const endedMatchData = await createNewEndedMatchObject(
					time_status,
					preMatchData,
					ss,
					stats?.aces,
					stats?.double_faults,
					stats?.win_1st_serve,
					stats?.break_point_conversions,
					events,
				)

				if (endedMatchData === undefined) {
					continue
				}

				await config.database.services.savers.saveNewEndedMatch(endedMatchData)

				newPlayerEndedMatchesStored++
			}
		}

		logger.info(
			`${newPlayerEndedMatchesStored} SAVED ended matches || ${playerEndedMatchesalreadyStored} EXISTING ended matches on DB || ${notEventviewForEndedMatch} Not even VIEW || ${toBeFixed} STATUS to be fixed || ${notStarted} STATUS to be started ${
				newPlayerEndedMatchesStored + playerEndedMatchesalreadyStored + notEventviewForEndedMatch + toBeFixed + notStarted
			} TOTAL ended matches for player with id: ${api_id} and name ${playerData.name}`,
		)
	} catch (err) {
		logger.error(err)
	}
}
