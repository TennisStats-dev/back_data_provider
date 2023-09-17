import type { Gender, Type } from 'types/schemas'
import { checkIfIsTeam } from './team.services'
import { checkIfIsDoubles, checkIfIsMen, checkIfIsMixedType, checkIfIsWomen } from './tournament.services'
import logger from '@config/logger'
import { gender, type } from 'constants/data'

export const getMatchType = (p1Name: string, p2Name: string, tournamentName: string, tournamentId: number): {gender: Gender, type: Type} => {
	if (checkIfIsMixedType(tournamentName)) {
		return {
            gender: gender.male,
            type: type.davisCup
        }
	}

	const isDoubles = checkIfIsDoubles(tournamentName) || (checkIfIsTeam(p1Name) && checkIfIsTeam(p2Name))

	const isWomen = checkIfIsWomen(tournamentName)

	const isMen = checkIfIsMen(tournamentName)

	if (!isWomen && !isMen) {
		logger.warn(`It's not possible to recognize GENDER for TOURNAMENT: ${tournamentName} with ID: ${tournamentId}`)
	}

	if (isDoubles && isWomen) {
		return {
            gender: gender.female,
            type: type.womenDoubles,
        }
	} else if (isDoubles && !isWomen) {
		return {
            gender: gender.male,
            type: type.menDoubles,
        }
	} else if (!isDoubles && isWomen) {
		return {
            gender: gender.female,
            type: type.women,
        }
	} else {
		return {
            gender: gender.male,
            type: type.men,
        }
	}
}

export const checkIfIsTennisMatch = (sportId: number): boolean => {
	return sportId === 13
}
