import type { IRanking } from 'types/types'
import { Schema, model } from 'mongoose'

const rankingSchema = new Schema<IRanking>(
	{
		date: { type: Date, required: true },
		ranking: [
			{
				rank: { type: Number, required: true },
				player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
				point: { type: Number, required: true },
				tourn_played: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true },
)

const Ranking = model<IRanking>('Ranking', rankingSchema)

export default Ranking
