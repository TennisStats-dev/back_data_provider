import type winston from 'winston'
import { format, createLogger, transports } from 'winston'
// import { MongoDB } from 'winston-mongoDB'
const { timestamp, combine, errors, json } = format

export function buildProdLogger(): winston.Logger {
	return createLogger({
		format: combine(timestamp(), errors({ stack: true }), json()),
		defaultMeta: { service: 'database-backend-service' },
		transports: [
            new transports.Console({level: 'info'}),
            // new MongoDB({
            //     level: 'warn',
            //     db: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            //     options: { useUnifiedTopology: true, },
            //     collection: 'serverdata'
            // }),
        ],
	})
}
