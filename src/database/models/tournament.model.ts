import { bestOfSets, ground } from 'constants/data'
import { type ITournament } from '../../types/schemas'
import { Schema, model } from 'mongoose'

const tournamentSchema = new Schema<ITournament>(
{
		api_id: { type: Number, required: true, unique: true },
		name: { type: String, required: true },
		circuit: { type: String, required: true },
		type:{ type: String, required: true },
		best_of_sets: { type: Number, enum: Object.values(bestOfSets), required: true },
		ground: { type: String, enum: Object.values(ground), required: true },
		city: { type: String },
		cc: { type: String },
	},
	{ timestamps: true },
)

const Tournament = model<ITournament>('Tournament', tournamentSchema)

export default Tournament
