import type { IDoublesPlayer, IPlayer } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { gender } from '@constants/data'

const playerSchema = new Schema<IPlayer | IDoublesPlayer>(
	{
		api_id: { type: Number, required: true, unique: true },
		name: { type: String, required: true },
		gender: { type: String, enum: Object.values(gender), required: true },
		birth: { type: Date },
		cc: { type: String },

		team: {
			p1: { type: Schema.Types.ObjectId, ref: 'Player' },
			p2: { type: Schema.Types.ObjectId, ref: 'Player' },
		},
	},
	{ timestamps: true },
)

const Player = model<IPlayer>('Player', playerSchema)

export { Player }
