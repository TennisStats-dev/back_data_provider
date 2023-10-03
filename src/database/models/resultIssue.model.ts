import { matchStatus } from '@constants/data'
import { Schema, model } from 'mongoose'
import type { IResultIssue } from 'types/schemas'

const resultIssueSchema = new Schema<IResultIssue>(
	{
		matchId: { type: Number, required: true, unique: true },
		home: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
		away: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
        status: { type: Number, enum: Object.values(matchStatus), required: true },
		details: { type: String, required: true },
	},
	{ timestamps: true },
)

const ResultIssue = model<IResultIssue>('ResultIssue', resultIssueSchema)

export default ResultIssue
