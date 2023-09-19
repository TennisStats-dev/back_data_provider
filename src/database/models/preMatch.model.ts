import type { IPreMatch } from 'types/schemas'
import { Schema, model } from 'mongoose'

const preMatchSchema = new Schema<IPreMatch>(
	{
		api_id: { type: Number, required: true, unique: true },
		bet365_id: { type: Number },
		sport_id: { type: Number, required: true },
		round: { type: String },
		tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
		court: { type: Schema.Types.ObjectId, ref: 'Court' },
		p1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		p2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		status: { type: Number, required: true },
		est_time: { type: Date, required: true },
	},
	{ timestamps: true },
)

const PreMatch = model<IPreMatch>('PreMatch', preMatchSchema)

export default PreMatch
