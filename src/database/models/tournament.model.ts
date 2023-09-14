import { bestoOfSets, ground } from 'constants/data'
import { type ITournament } from '../../types/schemas'
import { Schema, model } from 'mongoose'
import { countriesCC } from 'constants/countries'

const tournamentSchema = new Schema<ITournament>(
	{
		api_id: { type: Number, required: true },
		name: { type: String, required: true },
		best_of_sets: { type: Number, enum: bestoOfSets, required: true },
		ground: { type: String, enum: ground, required: true },
		city: { type: String, required: true },
		cc: { type: String, enum: countriesCC, required: true },
	},
	{ timestamps: true },
)

const Tournament = model<ITournament>('Tournament', tournamentSchema)

export default Tournament
