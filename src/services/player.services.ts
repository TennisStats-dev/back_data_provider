import config from '@config/index'
import type { Gender, IDoublesPlayer, IMatchPlayers, IMatchPlayersObject, IPlayer, Type } from 'types/schemas'
import { checkIfArrayIncludesSubstring } from '@utils/checkArrayIncludesSubstring'
import { countriesCCArray } from '@constants/countries'
import logger from '@config/logger'
import { type } from '@constants/data'

export const checkIfIsPlayer = (playerName: string): boolean => {
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

export const playerHandler = async (
	playersArray: IPlayer[],
	tournamentType: Type,
	matchGender: Gender,
): Promise<IMatchPlayers> => {
	const savedPlayers: IMatchPlayersObject = {
		home: undefined,
		away: undefined,
	}

	if (tournamentType === type.menDoubles || tournamentType === type.womenDoubles) {
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
	} else if (tournamentType === type.davisCup) {
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
	} else {
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
	}

	if (savedPlayers.home !== undefined && savedPlayers.away !== undefined) {
		return {
			home: savedPlayers.home,
			away: savedPlayers.away,
		}
	} else {
		throw new Error(
			`PROCESS: Player handler | INFO: Player handler missed and at least one player is undefined | DETAILS: home: ${playersArray[0].api_id} - away: ${playersArray[0].api_id}`,
		)
	}
}
