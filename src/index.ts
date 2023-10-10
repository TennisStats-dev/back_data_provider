// import module-alias from package.jdon once compiled (prod). It crashes the ts-node-dev if build folder is not up to date because when imported, ts node dev is fed by build folder
import 'module-alias/register'
import 'dotenv/config'
import express from 'express'
import config from './config'
import logger from '@config/logger'
// import { saveUpcomingMatches } from '@controllers/saveUpcomingMatchesController'
import { getAllPlayerEndedMatchesDetails, getEndedMatchDetails, getPreMatchDetails } from './test'
import { saveEndedMatchesFromPrematches } from '@controllers/saveEndedMatchesFromPreMatchesController'
import { saveUpcomingMatches } from '@controllers/saveUpcomingMatchesController'
import { updateTournamentCircuit } from '@controllers/updateTournamentData'
import { saveAllEndedMatches } from '@controllers/saveAllEndedMatchesController'
import { udpateEndedMatchesResult } from '@controllers/updateEndedMatchResult'
import { CronJob } from 'cron'
import { runCron } from '@controllers/runCron'


export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

app.get('/saveupcomingmatches', saveUpcomingMatches, saveEndedMatchesFromPrematches, udpateEndedMatchesResult)

app.get('/saveallendedmatches', saveAllEndedMatches)

app.get('/updatetournaments', updateTournamentCircuit)

app.get('/eventview/upcoming/:id', getPreMatchDetails)

app.get('/eventview/ended/:id', getEndedMatchDetails)

app.get('/matchhistory/:id', getAllPlayerEndedMatchesDetails)

config.database.connection.connectDB()

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const port = config.server.port || '0.0.0.0:$PORT'

app.listen(port, () => {
	logger.info(`Server running on port ${port}`)
})


let cronJobInProgress = false

const job = new CronJob(
	'*/2 * * * *',
	async function () {
		if (!cronJobInProgress) {
			cronJobInProgress = true
			await runCron()
			cronJobInProgress = false
		}
	},
	null,
);

job.start()

