const MATCH_STATUS = {
	0: 0, // notStarted
	1: 1, // inplay
	2: 2, // toBeFixed
	3: 3, // ended
	4: 4, // postponed
	5: 5, // cancelled
	6: 6, // walkover
	7: 7, // interrupted
	8: 8, // abandoned
	9: 9, // retired
	10: 10, // suspended
	11: 11, // decidedByFA
	99: 99, // removed
}

const MATCH_ROUND = {
	14: 14,
	15: 15,
	16: 16,
	17: 17,
	19: 19,
	23: 23,
	24: 24,
	25: 25,
	26: 26,
	27: 27,
	28: 28,
	29: 29,
	44: 44,
	54: 54,
	62: 62,
}

const ODDS_MARKET = {
	winner: '13_1',
	firstSetWinner: '13_4',
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
	clay: 'Clay',
	grass: 'Grass',
	hardOutdoor: 'Hardcourt outdoor',
	hardIndoor: 'Hardcourt indoor',
	syntheticOutdoor: 'Synthetic outdoor',
	syntheticIndoor: 'Synthetic indoor',
	carpetOutdoor: 'Carpet outdoor',
	carpetIndoor: 'Carpet indoor',
}

const CIRCUIT = ['ATP', 'WTA', 'ITF', 'Challenger', 'UTR', 'Davis Cup', 'Laver Cup', 'UK Pro League'] as const

export const CONSTANTS = {
	matchStatus: MATCH_STATUS,
	matchRounds: MATCH_ROUND,
	bestOfSets: BEST_OF_SETS,
	players: PLAYERS,
	ground: GROUND,
	circuit: CIRCUIT,
	oddsMarketsRef: ODDS_MARKET,
}
