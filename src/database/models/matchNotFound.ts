import { Schema, model } from 'mongoose'
import type { IMatchNotFound } from 'types/schemas'

const matchNotFoundSchema = new Schema<IMatchNotFound>(
	{
		matchId: { type: Number, required: true, unique: true },
        home: {
            api_id: { type: Number, required: true },
            name: { type: String, required: true },
        },
        away: {
            api_id: { type: Number, required: true },
            name: { type: String, required: true },
        },
        tournament: {
            api_id: { type: Number, required: true },
            name: { type: String, required: true },
        },
		details: { type: String, required: true },
	},
	{ timestamps: true },
)

const MatchNotFound = model<IMatchNotFound>('MatchNotFound', matchNotFoundSchema)

export default MatchNotFound
