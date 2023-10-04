import type { IPreMatch } from 'types/types'
import { Schema, model } from 'mongoose'

const preMatchSchema = new Schema<IPreMatch>(
	{
		api_id: { type: Number, required: true, unique: true },
		bet365_id: { type: Number },
		sport_id: { type: Number, required: true },
		type: { type: String, required: true },
		round: { type: String },
		tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
		court: { type: Schema.Types.ObjectId, ref: 'Court' },
		home: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		away: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		status: { type: Number, required: true },
		est_time: { type: Date, required: true },
		pre_odds: {
			first: {
				win: { type: [String, String], default: undefined },
				win_1st_set: { type: [String, String], default: undefined },
				time: { type: Date },
			},
			last: {
				win: { type: [String, String], default: undefined },
				win_1st_set: { type: [String, String], default: undefined },
				update: { type: Date },
			},
		},
	},
	{ timestamps: true },
)

const PreMatch = model<IPreMatch>('PreMatch', preMatchSchema)

export default PreMatch
