import config from '@config/index'
import type { Gender, IDoublesPlayer, IPlayer } from 'types/schemas'
import { checkIfArrayIncludesSubstring } from '@utils/checkArrayIncludesSubstring'
import { countriesCCArray } from '@constants/countries'
import logger from '@config/logger'

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
	if (cc !== null && !countriesCCArray.includes(cc)) {
		logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
		playerData.cc = cc
	} else if (cc !== null && countriesCCArray.includes(cc)) {
		playerData.cc = cc
	}

	return playerData
}

export const createNewDoublesPlayerObject = (
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
	if (cc !== undefined && !countriesCCArray.includes(cc)) {
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
