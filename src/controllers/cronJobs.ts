import logger from '@config/logger'
import { saveUpcomingMatchesCron } from './saveUpcomingMatchesController'
import { saveEndedMatchesFromPrematchesCron } from './saveEndedMatchesFromPreMatchesController'
import { udpateEndedMatchesResultCron } from './updateEndedMatchResult'
import { CronJob } from 'cron'
import { savePlayersHistoriesCron } from './saveMatchesHistories'
import { updateUpcomingMatchesDataCron } from './updateUpcomingMatchesData'
import { selfPing } from './selfPing'

const saveUpcomingCronJob = (): void => {
	try {
		let jobInProgress = false

		const saveUpcomingMatchesjob = new CronJob(
			'*/10 * * * * *',
			async function () {
				if (!jobInProgress) {
					jobInProgress = true
					await saveUpcomingMatchesCron()
					jobInProgress = false
				}
			},
			null,
		)

		saveUpcomingMatchesjob.start()
	} catch (error) {
		console.log(error)
		logger.error('Error while executing save upcoming matches cron')
	}
}
const updateUpcomingAndSaveEndedCronJob = (): void => {
	try {
		let jobInProgress = false

		const saveUpcomingMatchesjob = new CronJob(
			'*/10 * * * * *',
			async function () {
				if (!jobInProgress) {
					jobInProgress = true
					await updateUpcomingMatchesDataCron()
					await saveEndedMatchesFromPrematchesCron()

					jobInProgress = false
				}
			},
			null,
		)

		saveUpcomingMatchesjob.start()
	} catch (error) {
		console.log(error)
		logger.error('Error while executing save upcoming matches cron')
	}
}
const SavePlayerHistoriesCronJob = (): void => {
	try {
		let jobInProgress = false

		const saveUpcomingMatchesjob = new CronJob(
			'*/1 * * * *',
			async function () {
				if (!jobInProgress) {
					jobInProgress = true
					await savePlayersHistoriesCron()
					jobInProgress = false
				}
			},
			null,
		)

		saveUpcomingMatchesjob.start()
	} catch (error) {
		console.log(error)
		logger.error('Error while executing save ended matches cron')
	}
}
const udpateEndedMatchesResultCronJob = (): void => {
	try {
		let jobInProgress = false

		const saveUpcomingMatchesjob = new CronJob(
			'*/2 * * * *',
			async function () {
				if (!jobInProgress) {
					jobInProgress = true
					await udpateEndedMatchesResultCron()
					jobInProgress = false
				}
			},
			null,
		)

		saveUpcomingMatchesjob.start()
	} catch (error) {
		console.log(error)
		logger.error('Error while executing update ended matches result cron')
	}
}

const selfPingCronJob = (): void => {
	try {
		let jobInProgress = false

		const saveUpcomingMatchesjob = new CronJob(
			'*/14 * * * *',
			async function () {
				if (!jobInProgress) {
					jobInProgress = true
					await selfPing()
					jobInProgress = false
				}
			},
			null,
		)

		saveUpcomingMatchesjob.start()
	} catch (error) {
		console.log(error)
		logger.error('Error while executing update ended matches result cron')
	}

}

export const runCron = (): void => {
	saveUpcomingCronJob()
	updateUpcomingAndSaveEndedCronJob()
	SavePlayerHistoriesCronJob()
	udpateEndedMatchesResultCronJob()
	selfPingCronJob()
}
