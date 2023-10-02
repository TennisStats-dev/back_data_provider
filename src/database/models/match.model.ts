import type { IMatch } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { gameResult, matchStatus } from '@constants/data'

const MatchSchema = new Schema<IMatch>(
	{
		api_id: { type: Number, required: true, unique: true },
		bet365_id: { type: Number },
		sport_id: { type: Number, required: true },
		round: { type: String },
		tournament: {
			type: Schema.Types.ObjectId,
			ref: 'Tournament',
			required: true,
		},
		court: { type: Schema.Types.ObjectId, ref: 'Court' },
		home: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		away: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		status: { type: Number, enum: Object.values(matchStatus), required: true },
		est_time: { type: Date, required: true },
		pre_odds: {
			first: {
				win: { type: [String, String], default: undefined },
				win_1st_set: { type: [String, String], default: undefined },
				update: { type: Date },
			},
			last: {
				win: { type: [String, String], default: undefined },
				win_1st_set: { type: [String, String], default: undefined },
				time: { type: Date },
			},
		},
		// b365_start_time: { type: Date },
		// b365_end_time: { type: Date },
		match_stats: {
			result: { type: [String], required: true },
			aces: { type: [Number, Number] },
			df: { type: [Number, Number] },
			win_1st_serve: { type: [Number, Number] },
			bp: { type: [Number, Number] },
		},
		sets_stats: [
			{
				number: { type: Number },
				games_stats: [
					{
						summary: { type: String },
						won_points: { type: [Number, Number], default: undefined },
						total_bp: { type: Number },
						total_aces: { type: Number },
						points: [
							{
								result: { type: String, Number, enum: Object.values(gameResult) },
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
