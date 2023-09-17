import type winston from 'winston'
import { format, createLogger, transports } from 'winston'
const { printf, timestamp, combine, colorize, errors } = format

export function buildDevLogger(): winston.Logger {
	const logFormat = printf(({ level, message, timestamp, stack }) => {
		return `${timestamp} | ${level} | ${stack ?? message}`
	})

	return createLogger({
		format: combine(
			colorize(),
			timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			errors({ stack: true }),
			logFormat,
		),
		transports: [new transports.Console({ level: 'info' })],
	})
}
