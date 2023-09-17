import config from '@config/index'
import type { Gender, IPlayer } from 'types/schemas'
import { checkArrayIncludesSubstring } from 'utils/checkArrayIncludesSubstring'
import { countriesCCArray } from 'constants/countries'
import logger from '@config/logger'

export const checkIfIsPlayer = (playerName: string): boolean => {
	return !checkArrayIncludesSubstring(config.api.formats.Team, playerName)
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
	} else  if (cc !== null && countriesCCArray.includes(cc)) {
		playerData.cc = cc
	}

	return playerData
}

