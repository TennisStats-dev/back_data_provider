import mongoose from 'mongoose'
import logger from '@config/logger'

const dbURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const testDbURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`

function mongo(): void {
	if (process.env.NODE_ENV === 'development') {
		mongoose
		.connect(testDbURL)
		.then(() => {
			logger.info('Connected to TEST DB of mongoDB')
		})
		.catch((err) => {
			logger.error(err)
		})
	} else {
		if (process.env.NODE_ENV === 'development') {
			mongoose
			.connect(dbURL)
			.then(() => {
				logger.info('Connected to PRODUCTION DB of mongoDB')
			})
			.catch((err) => {
				logger.error(err)			})
		}
	}
}

const MONGO = {
	dbURL,
	testDbURL,
	connectDB: mongo
}

export default MONGO