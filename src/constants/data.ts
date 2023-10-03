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
	[API.constants.matchRounds[44]]: 'QR',
	[API.constants.matchRounds[54]]: 'QR',
	[API.constants.matchRounds[62]]: 'QR',
} as const

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

export const endedMatchStatus = [3, 5, 6, 8, 9]

export const grounds = {
	[API.constants.ground.clay]: {
		surface: 'Clay',
		location: 'Outdoor'
	},
	[API.constants.ground.grass]: {
		surface: 'Grass',
		location: 'Outdoor'
	},
	[API.constants.ground.hardOutdoor]: {
		surface: 'Hard',
		location: 'Outdoor'
	},
	[API.constants.ground.hardIndoor]: {
		surface: 'Hard',
		location: 'Indoor'
	},
	[API.constants.ground.carpetOutdoor]: {
		surface: 'Carpet',
		location: 'Outdoor'
	},
	[API.constants.ground.carpetIndoor]: {
		surface: 'Carpet',
		location: 'Indoor'
	},
	[API.constants.ground.syntheticOutdoor]: {
		surface: 'Carpet',
		location: 'Outdoor'
	},
	[API.constants.ground.syntheticIndoor]: {
		surface: 'Carpet',
		location: 'Indoor'
	},
} as const

const groundsArray = Array.from(Object.values(grounds))

export const surfaceArray = groundsArray.map(({surface}) => surface)
export const locationArray = groundsArray.map(({location}) => location)

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
	menMixed: 'M - MD',
} as const

export const typeArray = Array.from(Object.values(type))

export const bestOfSets = {
	[API.constants.bestOfSets[3]]: 3,
	[API.constants.bestOfSets[5]]: 5,
} as const 

