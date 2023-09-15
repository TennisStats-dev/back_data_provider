import type { IRequestsInfo } from 'types/schemas'
import { Schema, model } from 'mongoose'
import { hours } from 'constants/data'

const requestsInfoSchema = new Schema<IRequestsInfo>(
	{
		date: { type: String, required: true },
		hour: [
			{
				number: { type: Number, enum: hours, required: true },
                requests: { type: Number, default: 0, required: true },
			},
		],
	},
	{ timestamps: true },
)

const Request = model<IRequestsInfo>('Request', requestsInfoSchema)

export default Request
