import config from '@config/index'
import { bestOfSets, gender, grounds, type } from '@constants/data'
import type { Gender, ITournament, Type } from 'types/types'
import { checkIfArrayIncludesSubstring } from '@utils/checkArrayIncludesSubstring'
import logger from '@config/logger'
import { countriesArray, countriesCCArray } from '@constants/countries'
import type { MatchView } from '@API/types/MatchView'
import { API } from '@API/index'

const checkIfIsDoubles = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.doubleTournament, tournamentName)
}

const checkIfIsMixedType = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.mixedTypeTournament, tournamentName)
}

const checkIfIsWomen = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.womenTournament, tournamentName)
}

const checkIfIsMen = (tournamentName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.menTournament, tournamentName)
}

export const getTournamentCircuit = (
	tournamentName: string,
	tournamentId: number,
	matchId?: number,
): ITournament['circuit'] | undefined => {
	let circuitIndex: number | undefined

	config.api.constants.circuit.forEach((element, index) => {
		if (tournamentName.includes(element)) {
			circuitIndex = index
		}
	})

	if (circuitIndex === undefined) {
		logger.warn(
			`It was not possible to identify a CIRCUIT for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
		)
		return undefined
	} else {
		return config.api.constants.circuit[circuitIndex]
	}
}

const getTournamentTypeAndGender = (
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): { gender: Gender; type: Type } => {
	if (checkIfIsMixedType(tournamentName)) {
		return {
			gender: gender.male,
			type: type.menMixed,
		}
	}

	const isDoubles = checkIfIsDoubles(tournamentName)

	const isWomen = checkIfIsWomen(tournamentName)

	if (!tournamentName.includes(config.api.constants.circuit[2])) {
		const isMen = checkIfIsMen(tournamentName)

		if (!isWomen && !isMen) {
			logger.warn(
				`It was not possible to recognize GENDER for TOURNAMENT: ${tournamentName} with ID: ${tournamentId} - MATCH ID: ${matchId}`,
			)
		}
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
	bestOfSetsInput: string | undefined,
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): ITournament['best_of_sets'] => {
	if (bestOfSetsInput !== undefined) {
		const best_of_sets = bestOfSets[bestOfSetsInput]
		if (best_of_sets === undefined) {
			logger.warn(
				`It was not possible to identify a valid BEST OF SETS for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
			)
			return undefined
		}
		return best_of_sets
	} else {
		return undefined
	}
}

export const getTournamentGround = (
	groundInput: string | undefined,
	tournamentName: string,
	tournamentId: number,
	matchId: number,
): ITournament['ground'] => {
	if (groundInput !== undefined) {
		// If to monitorize Synthetic surface tournaments and check the real surface.
		if (groundInput === API.constants.ground.syntheticOutdoor || groundInput === API.constants.ground.syntheticIndoor) {
			logger.warn(
				`There is a match with a synthetic surface for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
			)
		}

		const ground = grounds[groundInput]

		if (ground === undefined) {
			logger.warn(
				`It was not possible to identify a valid GROUND for tournament: ${tournamentName} - ID: ${tournamentId} - MATCH ID: ${matchId}`,
			)
			return undefined
		}

		return ground
	}
	return undefined
}

const createNewCompletTournamentObject = (
	matchId: number,
	api_id: number,
	name: string,
	city: string,
	cc: string | null,
	countryInput: string,
	bestOfSetsInput: string | undefined,
	groundInput: string | undefined,
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

	if (cc !== null && countriesCCArray.includes(cc)) {
		tournamentData.cc = cc
	} else if (cc !== null && cc !== '' && !countriesCCArray.includes(cc)) {
		const countryName = countriesArray.find((country) => country.name === countryInput)
		if (countryName === undefined) {
			logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
			tournamentData.cc = cc
		} else {
			tournamentData.cc = countryName.cc
		}
	} else if (cc === null || cc === '') {
		const countryName = countriesArray.find((country) => country.name === countryInput)

		if (countryName != null) {
			tournamentData.cc = countryName.cc
		}
	}

	return tournamentData
}

const createNewIncompletTournamentObject = (
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

	if (cc !== null && cc !== '' && !countriesCCArray.includes(cc)) {
		logger.warn(`There is a player with a not stored cc - CC: ${cc}`)
		tournamentData.cc = cc
	} else if (cc !== null && countriesCCArray.includes(cc)) {
		tournamentData.cc = cc
	}

	return tournamentData
}

export const tournamentHandler = async (
	matchId: number,
	tournamentId: number,
	tournamentName: string,
	tournamentCC: string | null,
	eventViewAPIResponse: MatchView,
): Promise<ITournament> => {
	let tournament: ITournament

	const tournamentDB = await config.database.services.getters.getTournament(Number(tournamentId))

	if (tournamentDB !== null) {
		tournament = tournamentDB
	} else if (eventViewAPIResponse.extra !== undefined) {
		let best_of_sets: string | undefined
		let ground: string | undefined

		if (eventViewAPIResponse.extra.bestofsets !== undefined) {
			best_of_sets = eventViewAPIResponse.extra.bestofsets
		}
		if (eventViewAPIResponse.extra.ground !== undefined) {
			ground = eventViewAPIResponse.extra.ground
		}

		const tournamentObject = createNewCompletTournamentObject(
			Number(matchId),
			Number(tournamentId),
			tournamentName,
			eventViewAPIResponse.extra.stadium_data?.city,
			tournamentCC,
			eventViewAPIResponse.extra.stadium_data?.country,
			best_of_sets,
			ground,
		)
		const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
		tournament = savedTournament
	} else {
		const tournamentObject = createNewIncompletTournamentObject(
			Number(matchId),
			Number(tournamentId),
			tournamentName,
			tournamentCC,
		)
		const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
		tournament = savedTournament
	}

	return tournament
}
