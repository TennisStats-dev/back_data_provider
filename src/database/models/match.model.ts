import type { IMatch } from 'types/schemas'
import { Schema, model } from 'mongoose'
import {
	consistency,
	gameResult,
	matchStatusCode,
	playerOption,
} from 'constants/data'

const MatchSchema = new Schema<IMatch>(
	{
		api_id: { type: Number, required: true },
		bet365_id: { type: Number, required: true },
		sport_id: { type: Number, required: true },
		type: { type: String, required: true },
		round: { type: String, required: true },
		tournament: {
			type: Schema.Types.ObjectId,
			ref: 'Torunament',
			required: true,
		},
		court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
		p1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		p2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		status: { type: Number, enum: matchStatusCode, required: true },
		est_time: { type: Date, required: true },
		b365_start_time: { type: Date },
		b365_end_time: { type: Date },
		match_stats: [
			{
				result: { type: [String], required: true },
				aces: { type: [Number, Number], required: true },
				df: { type: [Number, Number], required: true },
				win_1st_serve: { type: [Number, Number], required: true },
				bp: { type: [Number, Number], required: true },
			},
		],
		sets_stats: [
			{
				number: { type: Number, required: true },
				games_stats: [
					{
						summary: { type: String, required: true },
						consistency: { type: Number, enum: consistency, required: true },
						service: { type: Number, enum: playerOption, required: true },
						winner: { type: Number, enum: playerOption, required: true },
						won_points: { type: [Number, Number], default: undefined },
						total_bp: { type: Number },
						total_aces: { type: Number },
						points: [
							{
								result: { type: String, enum: gameResult, required: true },
								odds: {
									win: { type: [Number, Number], default: undefined },
									win_1st_set: { type: [Number, Number], default: undefined },
								},
								time: { type: Date },
							},
						],
					},
				],
			},
		],
	},
	{ timestamps: true },
)

const Match = model<IMatch>('Match', MatchSchema)

export default Match
