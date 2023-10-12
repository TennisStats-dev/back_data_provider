import { matchStatus } from '@constants/data'
import { Schema, model } from 'mongoose'
import type { IStatusIssue } from 'types/types'

const statusIssueSchema = new Schema<IStatusIssue>(
	{
		matchId: { type: Number, required: true, unique: true },
		home_name: { type: String, required: true },
		away_name: { type: String, required: true },
		status: { type: Number, enum: Object.values(matchStatus), required: true },
        est_time: { type: Date, required: true },
	},
	{ timestamps: true },
)

const StatusIssue = model<IStatusIssue>('StatusIssue', statusIssueSchema)

export default StatusIssue
