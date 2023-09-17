import { type countriesCC } from 'constants/countries'
import type {
	matchStatus,
	matchRound,
	hours,
	genderArray,
	groundArray,
	gameResultArray,
	menCircuitArray,
	womenCircuitArray,
	typeArray,
	bestOfSets,
	consistencyArray,
	playerOptionArray,
} from 'constants/data'

export type CountriesCC = (typeof countriesCC)[number]

export type Status = (typeof matchStatus)[number]

export type Round = (typeof matchRound)[number]

export type Gender = (typeof genderArray)[number]

export type Ground = (typeof groundArray)[number]

export type GameResult = (typeof gameResultArray)[number]

export type MenCircuit = (typeof menCircuitArray)[number]

export type WomenCircuit = (typeof womenCircuitArray)[number]

export type Type = (typeof typeArray)[number]

export type BestOfSets = (typeof bestOfSets)[number]

export type Consistency = (typeof consistencyArray)[number]

export type PlayerOption = (typeof playerOptionArray)[number]

export type Hours = (typeof hours)[number]

export interface IPlayer {
	api_id: number
	name: string
	gender: Gender
	birth?: Date
	cc?: string
}

export interface ITeam {
	api_id: number
	team_p1: IPlayer
	team_p2: IPlayer
}

export interface ITournament {
	api_id: number
	name: string
	circuit: string
	type: Type
	best_of_sets: BestOfSets
	ground: Ground
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
	consistency: Consistency
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

export interface IPreMatch {
	api_id: number
	bet365_id: number
	sport_id: number
	round: Round
	tournament: ITournament
	court: ICourt
	p1: IPlayer | ITeam
	p2: IPlayer | ITeam
	status: Status
	est_time: Date
}

export interface IMatch extends IPreMatch {
	b365_start_time?: Date
	b365_end_time?: Date
	match_stats: IMatchStats
	sets_stats: ISetStats[]
}

export interface IPlayerRanking {
	rank: number
	player: IPlayer | ITeam
	points: number
	tourn_played: number
}

export interface IRanking {
	date: Date
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
