import { type countriesCC } from 'constants/countries'
import type { matchStatusCode, matchRound, gender, ground, gameResult, matchType, bestoOfSets, consistency, playerOption, hours } from 'constants/data'

export type CountriesCC = (typeof countriesCC)[number]

export type Status = (typeof matchStatusCode)[number]

export type Round = (typeof matchRound)[number]

export type Gender = (typeof gender)[number]

export type Ground = (typeof ground)[number]

export type GameResult = (typeof gameResult)[number]

export type MatchType = (typeof matchType)[number]

export type BestOfSets = (typeof bestoOfSets)[number]

export type Consistency = (typeof consistency)[number]

export type PlayerOption = (typeof playerOption)[number]

export type Hours = (typeof hours)[number]

export interface IPlayer {
	api_id: number
	name: string
	gender: Gender
	birth?: Date
	cc?: CountriesCC
	image_id?: string
}

export interface ITeam {
	api_id: number
	team_p1: IPlayer
	team_p2: IPlayer
}

export interface ITournament {
	api_id: number
	name: string
	best_of_sets: BestOfSets
	ground: Ground
	city: string
	cc: CountriesCC
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
	type: MatchType
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

interface IPetitions {
	hour: Hours
	petitions: number
}

export interface IRequestsInfo {
	day: Date
	hours: IPetitions[]
}