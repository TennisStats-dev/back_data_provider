const MATCH_STATUS = {
	notStarted: 0,
	inplay: 1,
	toBeFixed: 2,
	ended: 3,
	postponed: 4,
	cancelled: 5,
	walkover: 6,
	interrupted: 7,
	abandoned: 8,
	retired: 9,
	suspended: 10,
	decidedByFA: 11,
	removed: 99,
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
}

const BEST_OF_SETS = {
	3: '3',
	5: '5',
}

const PLAYERS = {
	p1: 'p1',
	p2: 'p2',
}

export const CONSTANTS = {
	matchStatus: MATCH_STATUS,
	matchRounds: MATCH_ROUND,
	bestOfSets: BEST_OF_SETS,
	players: PLAYERS,
}
