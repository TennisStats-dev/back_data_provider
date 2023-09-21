// import module-alias from package.jdon once compiled (prod). It crashes the ts-node-dev if build folder is not up to date because when imported, ts node dev is fed by build folder
import 'module-alias/register'
import 'dotenv/config'
import express from 'express'
import { saveUpcomingMatches } from '@controllers/matchControllers'
import { getMatchDetails } from './test'
import config from './config'
import logger from '@config/logger'

export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

app.get('/upcomingmatches', saveUpcomingMatches)

app.get('/eventview/:id', getMatchDetails)

config.database.connection.connectDB()

app.listen(config.server.port, () => {
	logger.info(`Server running on port ${config.server.port}`)
})
