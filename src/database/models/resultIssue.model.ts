import { matchStatus } from '@constants/data'
import { Schema, model } from 'mongoose'
import type { IResultIssue } from 'types/schemas'

const resultIssueSchema = new Schema<IResultIssue>(
	{
		matchId: { type: Number, required: true, unique: true },
        status: { type: Number, enum: Object.values(matchStatus), required: true },
		details: { type: String, required: true },
	},
	{ timestamps: true },
)

const ResultIssue = model<IResultIssue>('ResultIssue', resultIssueSchema)

export default ResultIssue
