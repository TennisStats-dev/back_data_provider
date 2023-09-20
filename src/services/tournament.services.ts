import config from '@config/index'
import { bestOfSets, gender, grounds, type } from '@constants/data'
import type { Gender, ITournament, Type } from 'types/schemas'
import { checkIfArrayIncludesSubstring } from '@utils/checkArrayIncludesSubstring'
import logger from '@config/logger'
import { countriesArray, countriesCCArray } from '@constants/countries'

export const checkIfIsDoubles = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.doubleTournament, tournamentName)
}

export const checkIfIsMixedType = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.mixedTypeTournament, tournamentName)
}

export const checkIfIsWomen = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.womenTournament, tournamentName)
}

export const checkIfIsMen = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.menTournament, tournamentName)
}

export const getTournamentCircuit = (
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): ITournament['circuit'] | undefined => {
	let circuitIndex: number | undefined

	config.api.constants.circuit.forEach((element, index) => {
		if (tournamentName.includes(element)) {
			circuitIndex = index
		}
	})

	if (circuitIndex === undefined) {
		logger.warn(`It was not possible to identify a CIRCUIT for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`)
		return undefined
	} else {
		return config.api.constants.circuit[circuitIndex]
	}
}

export const getTournamentTypeAndGender = (
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): { gender: Gender; type: Type } => {
	if (checkIfIsMixedType(tournamentName)) {
		return {
			gender: gender.male,
			type: type.davisCup,
		}
	}

	const isDoubles = checkIfIsDoubles(tournamentName)

	const isWomen = checkIfIsWomen(tournamentName)

	const isMen = checkIfIsMen(tournamentName)

	if (!isWomen && !isMen) {
		logger.warn(`It was not possible to recognize GENDER for TOURNAMENT: ${tournamentName} with ID: ${tournamentId} - MATCH ID: ${matchId}`)
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

export const getTournamentBestOfsets = (
	bestOfSetsInput: string,
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): ITournament['best_of_sets'] => {
	const best_of_sets = bestOfSets[bestOfSetsInput]

	if (best_of_sets === undefined) {
		logger.warn(
			`It was not possible to identify a valid BEST OF SETS for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
		)
		return undefined
	}

	return best_of_sets
}

export const getTournamentGround = (
	groundInput: string,
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): ITournament['ground'] => {
	const ground = grounds[groundInput]

	if (ground === undefined) {
		logger.warn(`It was not possible to identify a valid GROUND for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`)
		return undefined
	}
	return ground
}

export const createNewCompletTournamentObject = (
	matchId: number,
	api_id: number,
	name: string,
	bestOfSetsInput: string,
	groundInput: string,
	city: string,
	cc: string | null,
	countryInput: string,
): ITournament => {

	const { type } = getTournamentTypeAndGender(name, api_id, matchId)

	const circuit = getTournamentCircuit(name, api_id, matchId)

	const best_of_sets = getTournamentBestOfsets(bestOfSetsInput, name, api_id, matchId)

	const ground = getTournamentGround(groundInput, name, api_id, matchId)

	const tournamentData: ITournament = {
		api_id,
		name,
		city,
		circuit,
		type,
		best_of_sets,
		ground,
	}

	if (cc !== null && !countriesCCArray.includes(cc)) {
		const countryName = countriesArray.find((country) => country.name === countryInput)
		if (countryName === undefined) {
			logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
			tournamentData.cc = cc
		} else {
			tournamentData.cc = countryName.cc
		}
	} else if (cc !== null && countriesCCArray.includes(cc)) {
		tournamentData.cc = cc
	}

	return tournamentData
}

export const createNewIncompletTournamentObject = (
	matchId: number,
	api_id: number,
	name: string,
	cc: string | null,
): ITournament => {
	const { type } = getTournamentTypeAndGender(name, api_id, matchId)

	const circuit = getTournamentCircuit(name, api_id, matchId)
	const tournamentData: ITournament = {
		api_id,
		name,
		circuit,
		type,
	}

	if (cc !== null && !countriesCCArray.includes(cc)) {
		logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
		tournamentData.cc = cc
	} else if (cc !== null && countriesCCArray.includes(cc)) {
		tournamentData.cc = cc
	}

	return tournamentData
}


