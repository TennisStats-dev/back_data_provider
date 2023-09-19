// To parse this data:
//
//   import { Convert } from "./file";
//
//   const eventOdds = Convert.toEventOdds(json);

export interface EventOdds {
	success: number
	results: EventOdds
}

export interface EventOdds {
	stats: Stats
	odds: {
		13_1?: Odd[]
		13_4?: Odd[]
	}
}

export interface Odd {
	id: string
	home_od: string
	away_od: string
	ss: null
	add_time: string
}

export interface Stats {
	matching_dir?: number
	odds_update?: OddsUpdate
}

export interface OddsUpdate {
	'13_1': number
}

// Converts JSON strings to/from your types
export class Convert {
	public static toEventOdds(json: string): EventOdds[] {
		return JSON.parse(json)
	}

	public static eventOddsToJson(value: EventOdds[]): string {
		return JSON.stringify(value)
	}
}
