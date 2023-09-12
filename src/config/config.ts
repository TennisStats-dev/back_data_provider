import dotenv from 'dotenv'
import mongo from '@database/config'
dotenv.config()

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost'
const SERVER_PORT = process.env.SERVER_PORT ?? 3000

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const config = {
    server: SERVER,
    connectDB: mongo
}

export default config
