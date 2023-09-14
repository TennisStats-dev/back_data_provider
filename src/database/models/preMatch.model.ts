import type { IPreMatch } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { matchStatusCode } from 'constants/data'

const preMatchSchema = new Schema<IPreMatch>(
	{
		api_id: { type: Number, required: true },
		bet365_id: { type: Number, required: true },
		sport_id: { type: Number, required: true },
		type: { type: String, required: true },
		round: { type: String, required: true },
		tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
		court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
		p1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		p2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		status: { type: Number, enum: matchStatusCode, required: true },
		est_time: { type: Date, required: true },
	},
	{ timestamps: true },
)

const PreMatch = model<IPreMatch>('PreMatch', preMatchSchema)

export default PreMatch
