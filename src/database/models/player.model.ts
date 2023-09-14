import { type IPlayer } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { gender } from 'constants/data'
import { countriesCC } from 'constants/countries'

const playerSchema = new Schema<IPlayer>(
	{
		api_id: { type: Number, required: true },
		name: { type: String, required: true },
		gender: { type: String, enum: gender, required: true },
		birth: { type: Date },
		cc: { type: String, enum: countriesCC },
		image_id: { type: String },
	},
	{ timestamps: true },
)

const Player = model<IPlayer>('Player', playerSchema)
const TempPlayer = model<IPlayer>('TempPlayer', playerSchema)

export {Player, TempPlayer}
