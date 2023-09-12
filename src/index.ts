import express from 'express'
import matches from './routes/matches'
// import config from '@config/config'

export const app = express()
app.use(express.json())

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

app.use('/api/matches', matches)

// app.listen(config.PORT, () => {
// 	console.log(`Server running on port ${config.PORT}`)
// })