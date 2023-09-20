import { API } from "@API/index"

export const matchRound = {
	[API.constants.matchRounds[14]]: 'QR1',
	[API.constants.matchRounds[15]]: 'QR2',
	[API.constants.matchRounds[16]]: 'QR3',
	[API.constants.matchRounds[17]]: 'QR4',
	[API.constants.matchRounds[19]]: 'QR',
	[API.constants.matchRounds[23]]: 'R128',
	[API.constants.matchRounds[24]]: 'R64',
	[API.constants.matchRounds[25]]: 'R32',
	[API.constants.matchRounds[26]]: 'R16',
	[API.constants.matchRounds[27]]: 'QF',
	[API.constants.matchRounds[28]]: 'SF',
	[API.constants.matchRounds[29]]: 'F',
} as const

export const matchRound2 = {
	14: 'QR1',
	15: 'QR2',
	16: 'QR3',
	17: 'QR4',
	19: 'QR',
	23: 'R128',
	24: 'R64',
	25: 'R32',
	26: 'R16',
	27: 'QF',
	28: 'SF',
	29: 'F',
}


// Status description
// export const matchStatus = {
// 	[API.constants.matchStatus.notStarted]: {
// 		code: 0,
// 		description: 'Not started',
// 	},
// 	[API.constants.matchStatus.inplay]: {
// 		code: 1,
// 		description: 'Inplay',
// 	},
// 	[API.constants.matchStatus.toBeFixed]: {
// 		code: 2,
// 		description: 'To be fixed',
// 	},
// 	[API.constants.matchStatus.ended]: {
// 		code: 3,
// 		description: 'Ended',
// 	},
// 	[API.constants.matchStatus.postponed]: {
// 		code: 4,
// 		description: 'Postponed',
// 	},
// 	[API.constants.matchStatus.cancelled]: {
// 		code: 5,
// 		description: 'Cancelled',
// 	},
// 	[API.constants.matchStatus.walkover]: {
// 		code: 6,
// 		description: 'Walkover',
// 	},
// 	[API.constants.matchStatus.interrupted]: {
// 		code: 7,
// 		description: 'Interrupted',
// 	},
// 	[API.constants.matchStatus.abandoned]: {
// 		code: 8,
// 		description: 'Abandoned',
// 	},
// 	[API.constants.matchStatus.retired]: {
// 		code: 9,
// 		description: 'Retired',
// 	},
// 	[API.constants.matchStatus.suspended]: {
// 		code: 10,
// 		description: 'Suspended',
// 	},
// 	[API.constants.matchStatus.decidedByFA]: {
// 		code: 11,
// 		description: 'Decided by FA',
// 	},
// 	[API.constants.matchStatus.removed]: {
// 		code: 11,
// 		description: 'Removed',
// 	}
// } as const



export const matchStatus = {
	[API.constants.matchStatus[0]]: 0,
	[API.constants.matchStatus[1]]: 1,
	[API.constants.matchStatus[2]]: 2,
	[API.constants.matchStatus[3]]: 3,
	[API.constants.matchStatus[4]]: 4,
	[API.constants.matchStatus[5]]: 5,
	[API.constants.matchStatus[6]]: 6,
	[API.constants.matchStatus[7]]: 7,
	[API.constants.matchStatus[8]]: 8,
	[API.constants.matchStatus[9]]: 9,
	[API.constants.matchStatus[10]]: 10,
	[API.constants.matchStatus[11]]: 11,
	[API.constants.matchStatus[99]]: 99,
} as const

export const grounds = {
	[API.constants.ground.clay.format]: 'clay',
	[API.constants.ground.grass.format]: 'grass',
	[API.constants.ground.hard.format]: 'hard',
	[API.constants.ground.indoor.format]: 'indoor',
} as const

export const groundArray = Array.from(Object.values(grounds))

export const gender = {
	male: 'M',
	female: 'F',
} as const

export const genderArray = Array.from(Object.values(gender))

export const gameResult = {
	p15_0: '15-0',
	p0_15: '0-15',
	p15_15: '15-15',
	p30_15: '30-15',
	p15_30: '15-30',
	p30_30: '30-30',
	p40_30: '40-30',
	p30_40: '30-40',
	p40_40: '40-40',
	pA_40: 'A-40',
	p40_A: '40-A',
} as const

export const gameResultArray = Array.from(Object.values(gameResult))

export const circuitArray = API.constants.circuit

export const type = {
	men: 'M',
	women: 'W',
	menDoubles: 'MD',
	womenDoubles: 'WD',
	davisCup: 'DC',
} as const

export const typeArray = Array.from(Object.values(type))

export const playerType = ['Player', 'Team'] as const


export const bestOfSets = {
	[API.constants.bestOfSets[3]]: 3,
	[API.constants.bestOfSets[5]]: 5,
} as const 

export const consistency = {
	worst: 0, // Lack of info about number of points
	bad: 1, // Number of points well known but not their order
	good: 2, // all points and their order well known
} as const

export const consistencyArray = Array.from(Object.values(consistency))

export const playerOption = {
	1: 1,
	2: 2,
} as const

export const playerOptionArray = Array.from(Object.values(playerOption))

export const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] as const

