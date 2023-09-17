// import module-alias from package.jdon once compiled (prod). It crashes the ts-node-dev if build folder is not up to date
// import 'module-alias/register'

import 'dotenv/config'
import config from '@config/index'
import express from 'express'
import logger from '@config/logger'

// import { saveNewCourtOnDB } from '@database/services/court.services'

export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

config.database.connection.connectDB()

app.listen(config.server.port, () => {
	logger.info(`Server running on port ${config.server.port}`)
})

// const prueba = async (_req: Request, _res: Response): Promise<void> => {
// 	const players: IPlayer[] = []

// 	const team1Data = await config.api.services.getTeamMembers(728800)

// 	const promises = team1Data.map(async (player, i): Promise<any> => {
// 		// eslint-disable-next-line no-async-promise-executor
// 		// return await new Promise(async (resolve: any) => {
// 		// 	setTimeout( async () => {
// 				const playerDB = await config.database.services.getters.getPlayer(Number(player.id))

// 				if (playerDB != null) {
// 					players[i]= playerDB
// 				} else {
// 					const playerObject = createNewPlayerObject(Number(player.id), player.name, 'M', player.cc)
// 					const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playerObject)
// 					players[i]= savedPlayer
// 				}
// 			// 	resolve(playerDB)
// 			// }, 2000 - i*100)
// 		// })
// 	})

// 	console.log('antes de resolver las promesas ', promises)

// 	const res = await Promise.allSettled(promises)

// 	console.log('promesas resultas', res)
// 	console.log(players)
// }

// app.use('/api/matches', prueba)

// -------

// const saveTeam = async (_req: Request, _res: Response): Promise<void> => {

// 	try {
// 		const team_p1 = await config.database.services.savers.saveNewTempPlayer({ name: '3', api_id: 3, gender: 'M' })
// 		const team_p2 = await config.database.services.savers.saveNewTempPlayer({ name: '4', api_id: 4, gender: 'M' })
// 		await config.database.services.savers.saveNewTempTeam({api_id: 1, team_p1: team_p1._id, team_p2: team_p2._id})
// 	} catch (err) {
// 		logger.error(`FUNCIONALITY: save upcoming matches `, err)
// 	}
// }

// app.get('/matches', saveUpcomingMatches)

// app.get('/team', saveTeam)
