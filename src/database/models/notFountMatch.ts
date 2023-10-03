import { Schema, model } from 'mongoose'
import type { INotFoundMatch } from 'types/schemas'

const notFoundMatchSchema = new Schema<INotFoundMatch>(
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

const NotFoundMatch = model<INotFoundMatch>('NotFoundMatch', notFoundMatchSchema)

export default NotFoundMatch
