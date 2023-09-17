import config from '@config/index'
// import { BestOfSets, Ground, ITournament, Type } from 'types/schemas'
// import type { BestOfSets, Ground, ITournament } from 'types/schemas'
import { checkArrayIncludesSubstring } from 'utils/checkArrayIncludesSubstring'

export const checkIfIsDoubles = (tournamentName: string): boolean => {
	return checkArrayIncludesSubstring(config.api.formats.doubleTournament, tournamentName)
}

export const checkIfIsMixedType = (tournamentName: string): boolean => {
	return checkArrayIncludesSubstring(config.api.formats.mixedTypeTournament, tournamentName)
}

export const checkIfIsWomen = (tournamentName: string): boolean => {
	return checkArrayIncludesSubstring(config.api.formats.womenTournament, tournamentName)
}

export const checkIfIsMen = (tournamentName: string): boolean => {
	return checkArrayIncludesSubstring(config.api.formats.menTournament, tournamentName)
}

// export const createTournamentObject = (api_id: number, name: string, circuit: string, type: string, best_of_sets: string, ground: string, city: string, cc: string): ITournament => {

// 	const 


// const tournamentData = {
// 	api_id,
// 	name,
// 	circuit,
// 	city,
// }

// if (validateAtribute.cc(cc)) {
// 	tournamentData.cc = cc
// }

// } 

// }
