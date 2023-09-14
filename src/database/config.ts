import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const testDbURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
function mongo(): void {
	if (process.env.NODE_ENV === 'development') {
		mongoose
		.connect(testDbURL)
		.then(() => {
			console.log('Connected to TEST DB of mongoDB')
		})
		.catch((err) => {
			console.log(err)
		})
	} else {
		if (process.env.NODE_ENV === 'development') {
			mongoose
			.connect(dbURL)
			.then(() => {
				console.log('Connected to PRODUCTION DB of mongoDB')
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
}

const MONGO = {
	dbURL,
	testDbURL,
	connectDB: mongo
}

export default MONGO