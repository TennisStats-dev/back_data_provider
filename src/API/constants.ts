

const MATCH_STATUS = {
	0: 0, // notStarted
	1: 1, // inplay
	2 : 2, // toBeFixed
	3 : 3, // ended
	4 : 4, // postponed
	5 : 5, // cancelled
	6 : 6, // walkover
	7 : 7, // interrupted
	8 : 8, // abandoned
	9 : 9, // retired
	10 : 10, // suspended
	11 : 11, // decidedByFA
	99 : 99, // removed
}

const MATCH_ROUND = {
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
	54: 'Q'
}

const BEST_OF_SETS = {
	3: '3',
	5: '5',
}

const PLAYERS = {
	p1: 'p1',
	p2: 'p2',
}

const GROUND = {
	clay: {
		format: 'Clay',
	},
	grass: {
		format: 'Grass',
	},
	hard: {
		format: 'Hardcourt outdoor',
	},
	indoor: {
		format: 'Hardcourt indoor',
	},
}

const CIRCUIT = ['ATP', 'WTA', 'ITF', 'Challenger', 'UTR', 'Davis Cup'] as const

export const CONSTANTS = {
	matchStatus: MATCH_STATUS,
	matchRounds: MATCH_ROUND,
	bestOfSets: BEST_OF_SETS,
	players: PLAYERS,
	ground: GROUND,
	circuit: CIRCUIT
}
