import type { ITeam } from 'types/schemas'
import { Schema, model } from 'mongoose'

const teamSchema = new Schema<ITeam>(
	{
		api_id: { type: Number, required: true },
		team_p1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		team_p2: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
	},
	{ timestamps: true },
)

const Team = model<ITeam>('Team', teamSchema)

export default Team
