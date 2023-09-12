import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`

export default function mongo(): void {
	mongoose
		.connect(dbURL)
		.then(() => {
			console.log('Connected to mongoDB')
		})
		.catch((err) => {
			console.log(err)
		})
}
