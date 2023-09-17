import type { ICourt } from 'types/schemas'
import { Schema, model } from 'mongoose'

const courtSchema = new Schema<ICourt>(
	{
		api_id: { type: Number, required: true, unique: true },
		name: { type: String, required: true },
	},
	{ timestamps: true },
)

const Court = model<ICourt>('Court', courtSchema)

export default Court
