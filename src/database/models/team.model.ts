import type { ITeam } from 'types/schemas'
import { Schema, model } from 'mongoose'

const teamSchema = new Schema<ITeam>(
	{
		api_id: { type: Number, required: true, unique: true },
		team_p1: { type: Schema.Types.ObjectId, ref: 'Player' },
		team_p2: { type: Schema.Types.ObjectId, ref: 'Player' },
	},
	{ timestamps: true },
)

const Team = model<ITeam>('Team', teamSchema)
const TempTeam = model<ITeam>('TempTeam', teamSchema)

export {Team, TempTeam}
