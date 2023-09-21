import { type countriesCC } from '@constants/countries'
import type {
	matchStatus,
	matchRound,
	hours,
	genderArray,
	groundArray,
	gameResultArray,
	typeArray,
	bestOfSets,
	consistencyArray,
	playerOptionArray,
	circuitArray,
	playerType,
} from '@constants/data'

export type CountriesCC = (typeof countriesCC)[number]

export type Status = (typeof matchStatus)[number]

export type Round = (typeof matchRound)[number]

export type Gender = (typeof genderArray)[number]

export type Ground = (typeof groundArray)[number]

export type GameResult = (typeof gameResultArray)[number]

export type Circuit = (typeof circuitArray)[number]

export type Type = (typeof typeArray)[number]

export type PlayerType = (typeof playerType)[number]

export type BestOfSets = (typeof bestOfSets)[number]

export type Consistency = (typeof consistencyArray)[number]

export type PlayerOption = (typeof playerOptionArray)[number]

export type Hours = (typeof hours)[number]

// export interface IPlayerDetails {
// 	api_id: number
// 	name: string
// 	gender: Gender
// 	birth?: Date
// 	cc?: string
// }

export interface ITournament {
	api_id: number
	name: string
	circuit?: Circuit
	type: Type
	best_of_sets?: BestOfSets
	ground?: Ground
	city?: string
	cc?: string
}

export interface ICourt {
	api_id: number
	name: string
}

interface IMatchStats {
	result: Array<`${number}-${number}`>
	aces: [number, number]
	df: [number, number]
	win_1st_serve: [number, number]
	bp: [number, number]
	consistency: Consistency
}

interface IPbP {
	result: GameResult
	odds?: {
		win?: [number, number]
		win_1st_set?: [number, number]
	}
	time?: Date
}

interface IGameStats {
	summary: string
	service: PlayerOption
	winner: PlayerOption
	won_points?: [number, number]
	total_bp?: number
	total_aces?: number
	points?: IPbP[]
}

interface ISetStats {
	number: number
	games_stats: IGameStats[]
}

export interface IPreOdds {
	last: {
		win: [number, number]
		win_1st_set?: [number, number]
		update: Date
	}
	first: {
		win: [number, number]
		win_1st_set?: [number, number]
		time: Date
	}
}

export interface IPlayer {
	api_id: number
	name: string
	gender: Gender
	birth?: Date
	cc?: string
}

export interface IDoublesPlayer {
	api_id: number
	name: string
	gender: Gender
	birth?: Date
	cc?: string
	team: {
		p1: IPlayer,
		p2?: IPlayer
	}
}

export interface IPreMatch {
	api_id: number
	bet365_id?: number
	sport_id: number
	type: Type
	round?: Round
	tournament: ITournament
	court?: ICourt
	home: IPlayer | IDoublesPlayer
	away: IPlayer | IDoublesPlayer
	status: Status
	est_time: Date
	pre_odds?: IPreOdds
}

export interface IMatch extends IPreMatch {
	b365_start_time?: Date
	b365_end_time?: Date
	match_stats: IMatchStats
	sets_stats: ISetStats[]
}

export interface IPlayerRanking {
	rank: number
	player: IPlayer | [IPlayer, IPlayer]
	points: number
	tourn_played: number
}

export interface IRanking {
	date: Date
	type: Type
	ranking: IPlayerRanking[]
}

interface IRequests {
	number: Hours
	requests: number
}

export interface IRequestsInfo {
	date: string
	hour: IRequests[]
}


export interface IMatchPlayers {
	home: IPlayer | IDoublesPlayer
	away: IPlayer | IDoublesPlayer
}

export interface IMatchPlayersObject {
	home: IPlayer | IDoublesPlayer | undefined
	away: IPlayer | IDoublesPlayer | undefined
}