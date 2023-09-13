import type winston from 'winston'
import { format, createLogger, transports } from 'winston'
import { MongoDB } from 'winston-mongoDB'
import config from '..'
const { timestamp, combine, errors, json } = format

export function buildProdLogger(): winston.Logger {
	return createLogger({
		format: combine(timestamp(), errors({ stack: true }), json()),
		defaultMeta: { service: 'database-backend-service' },
		transports: [
            new transports.Console({level: 'info'}),
            new MongoDB({
                level: 'warn',
                db: config.database.dbURL,
                options: { useUnifiedTopology: true, },
                collection: 'serverdata'
            }),
        ],
	})
}
