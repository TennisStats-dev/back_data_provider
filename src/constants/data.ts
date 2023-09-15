const matchRound = [
	'QR1',
	'QR2',
	'QR3',
	'QR4',
	'QR',
	'R128',
	'R64',
	'R32',
	'R16',
	'QF',
	'SF',
	'F',
] as const

const matchStatus = [
	{
		code: 0,
		description: 'Not started',
	},
	{
		code: 1,
		description: 'Inplay',
	},
	{
		code: 2,
		description: 'To be fixed',
	},
	{
		code: 3,
		description: 'Ended',
	},
	{
		code: 4,
		description: 'Postponed',
	},
	{
		code: 5,
		description: 'Cancelled',
	},
	{
		code: 6,
		description: 'Walkover',
	},
	{
		code: 7,
		description: 'Interrupted',
	},
	{
		code: 8,
		description: 'Abandoned',
	},
	{
		code: 9,
		description: 'Retired',
	},
	{
		code: 10,
		description: 'Suspended',
	},
	{
		code: 11,
		description: 'Decided by FA',
	},
	{
		code: 99,
		description: 'Removed',
	},
] as const

const matchStatusCode = [...matchStatus.map((status) => status.code)] as const

const ground = ['hard', 'clay', 'grass', 'indoor'] as const

const gender = ['M', 'F'] as const

const gameResult = [
	'15-0',
	'0-15',
	'15-15',
	'30-15',
	'15-30',
	'30-30',
	'40-30',
	'30-40',
	'40-40',
	'A-40',
	'40-A',
	1,
	2,
] as const

const matchType = ['M', 'W', 'MD', 'WD'] as const

const bestoOfSets = [3, 5] as const

const consistency = [0, 1, 2] as const

const playerOption = [1, 2] as const

const hours = [0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 , 12 , 13 , 14 , 15 , 16 , 17 , 18 , 19 , 20 , 21 , 22 , 23 ] as const

export {
	matchRound,
	matchStatus,
	matchStatusCode,
	ground,
	gender,
	gameResult,
	matchType,
	bestoOfSets,
	consistency,
	playerOption,
	hours
}
