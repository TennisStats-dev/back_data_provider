import MONGO from '@database/config'
import { API } from 'API/config'

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost'
const SERVER_PORT = process.env.SERVER_PORT ?? 3000

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
}

const config = {
	server: SERVER,
	database: MONGO,
	api: API,
}

export default config
