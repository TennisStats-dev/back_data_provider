// import module-alias from package.jdon once compiled (prod). It crashes the ts-node-dev if build folder is not up to date because when imported, ts node dev is fed by build folder
import 'module-alias/register'
import 'dotenv/config'
import express from 'express'
import config from './config'
import logger from '@config/logger'
// import { saveUpcomingMatches } from '@controllers/saveUpcomingMatchesController'
import { getMatchDetails } from './test'
import { saveEndedMatches } from '@controllers/saveEndedMatchesController'
import { saveUpcomingMatches } from '@controllers/saveUpcomingMatchesController'
import { updateTournamentCircuit } from '@controllers/updateTournamentData'

export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

app.get('/upcomingmatches', saveUpcomingMatches, saveEndedMatches)

app.get('/eventview/:id', getMatchDetails)

app.get('/updatetournaments', updateTournamentCircuit)

config.database.connection.connectDB()

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const port = config.server.port || '0.0.0.0:$PORT'

app.listen(port, () => {
	logger.info(`Server running on port ${port}`)
})