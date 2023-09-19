import config from '@config/index'
import { bestOfSets, gender, grounds, type } from 'constants/data'
import type { BestOfSets, Gender, Ground, ITournament, Type } from 'types/schemas'
import { checkIfArrayIncludesSubstring } from 'utils/checkArrayIncludesSubstring'
import { checkIfIsTeam } from './team.services'
import logger from '@config/logger'
import { API } from 'API'
import { countriesArray, countriesCCArray } from 'constants/countries'

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
): ITournament['circuit'] => {
	let circuitIndex: number | undefined

	config.api.constants.circuit.forEach((element, index) => {
		if (tournamentName.includes(element)) {
			circuitIndex = index
		}
	})

	if (circuitIndex === undefined) {
		logger.warn(`It was not possible to identify a CIRCUIT for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`)
		return 'unknown'
	} else {
		return config.api.constants.circuit[circuitIndex]
	}

	// const circuit = circuitsArray.find((constant, index) => {
	// 	if (tournamentName.includes(constant)) {
	// 		return index
	// 	}
	// })

	// if (circuit === undefined) {
	// 	logger.warn(`It was not possible to identify a CIRCUIT for tournament: ${tournamentName} - ID: ${tournamentId}`)
	// 	return 'unknown'
	// }

	// return circuit
}

export const getTournamentTypeAndGender = (
	p1Name: string,
	p2Name: string,
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

	const isDoubles = checkIfIsDoubles(tournamentName) || (checkIfIsTeam(p1Name) && checkIfIsTeam(p2Name))

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
): BestOfSets => {
	const best_of_sets = bestOfSets[bestOfSetsInput]

	if (best_of_sets === undefined) {
		logger.warn(
			`It was not possible to identify a valid BEST OF SETS for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
		)
		return bestOfSets[3]
	}

	return best_of_sets
}

export const getTournamentGround = (
	groundInput: string,
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): Ground => {
	const ground = grounds[groundInput]

	if (ground === undefined) {
		logger.warn(`It was not possible to identify a valid GROUND for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`)
		return grounds[API.constants.ground.hard.format]
	}

	return ground
}

export const createNewCompletTournamentObject = (
	matchId: number,
	api_id: number,
	name: string,
	p1Name: string,
	p2Name: string,
	bestOfSetsInput: string,
	groundInput: string,
	city: string,
	cc: string | null,
	countryInput: string,
): ITournament => {
	const { type } = getTournamentTypeAndGender(p1Name, p2Name, name, api_id, matchId)

	const circuit = getTournamentCircuit(name, api_id, matchId)

	const best_of_sets = getTournamentBestOfsets(bestOfSetsInput, name, api_id, matchId)

	const ground = getTournamentGround(groundInput, name, api_id, matchId)

	const tournamentData: ITournament = {
		api_id,
		name,
		circuit,
		city,
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
	p1Name: string,
	p2Name: string,
	cc: string | null,
): ITournament => {
	const { type } = getTournamentTypeAndGender(p1Name, p2Name, name, api_id, matchId)

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
