// import module-alias from package.jdon once compiled (prod). It crashes the ts-node-dev if build folder is not up to date
// import 'module-alias/register'

import express from 'express'
import matches from './routes/matches'
import config from '@config/index'
import logger from '@config/logger'

export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

app.use('/api/matches', matches)

config.database.connectDB()

app.listen(config.server.port, () => {
	logger.info('logger running')
	logger.warn('warn text')
	logger.error('error text')
	logger.error(new Error('errror'))
	console.log(`Server running on port ${config.server.port}`)
})
