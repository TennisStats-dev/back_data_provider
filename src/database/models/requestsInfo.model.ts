import type { IRequestsInfo } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { hours } from 'constants/data'

const requestsInfoSchema = new Schema<IRequestsInfo>(
	{
		day: { type: Date, required: true },
		hours: [
			{
				hour: { type: Date, enum: hours, required: true },
                petitions: { type: Number, required: true },
			},
		],
	},
	{ timestamps: true },
)

const RequestsInfo = model<IRequestsInfo>('Team', requestsInfoSchema)

export default RequestsInfo
