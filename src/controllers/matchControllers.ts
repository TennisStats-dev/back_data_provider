import logger from '@config/logger'
import type { Request, Response } from 'express'
import { type UpcomingMatches } from '@API/types/upcomingMatches'
import config from '@config/index'
import { gender, type } from '@constants/data'
import type { ICourt, IDoublesPlayer, IPlayer, IPreMatch, IPreOdds, ITournament } from 'types/schemas'
import { createNewPreMatchObject, getMatchPreOdds } from '@services/match.services'
import { createNewDoublesPlayerObject, createNewPlayerObject } from '@services/player.services'
import { createNewCourtObject } from '@services/court.services'
import { createNewCompletTournamentObject, createNewIncompletTournamentObject } from '@services/tournament.services'
import { msToTime } from '@utils/msToTime'

export const saveUpcomingMatches = async (_req: Request, _res: Response): Promise<void> => {
	try {
		const startDate = new Date()

		logger.info(`Save upcoming matches started at: ${startDate.toString()}`)
		const allUpcomingMatches: UpcomingMatches[] = []
		let page = 1

		const upcomingMatchesApiResponse = await config.api.services.getUpcomingMatches(page)
		allUpcomingMatches.push(...upcomingMatchesApiResponse.results)

		do {
			page += 1
			const apiResponse = await config.api.services.getUpcomingMatches(page)
			allUpcomingMatches.push(...apiResponse.results)
		} while (allUpcomingMatches.length < upcomingMatchesApiResponse.pager.total)

		const newMatchesSaved: IPreMatch[] = []

		for (const match of allUpcomingMatches) {
			if ((await config.database.services.getters.getPreMatch(Number(match.id))) !== null) {
				continue
			}

			const eventView = await config.api.services.getEventView(Number(match.id))

			let tournament: ITournament
			let home: IPlayer | IDoublesPlayer | null = null
			let away: IPlayer | IDoublesPlayer | null = null
			let court: ICourt | null = null
			let pre_odds: IPreOdds | null = null

			const tournamentDB = await config.database.services.getters.getTournament(Number(match.league.id))

			if (tournamentDB !== null) {
				tournament = tournamentDB
			} else if (eventView.extra !== undefined) {
				let best_of_sets: string | undefined
				let ground: string | undefined

				if (eventView.extra.bestofsets !== undefined) {
					best_of_sets = eventView.extra.bestofsets
				}
				if (eventView.extra.ground !== undefined) {
					ground = eventView.extra.ground
				}

				const tournamentObject = createNewCompletTournamentObject(
					Number(match.id),
					Number(match.league.id),
					match.league.name,
					eventView.extra.stadium_data?.city,
					match.league.cc,
					eventView.extra.stadium_data?.country,
					best_of_sets,
					ground,
				)
				const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
				tournament = savedTournament
			} else {
				const tournamentObject = createNewIncompletTournamentObject(
					Number(match.id),
					Number(match.league.id),
					match.league.name,
					match.league.cc,
				)
				const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
				tournament = savedTournament
			}

			const matchGender =
				tournament.type === type.women || tournament.type === type.womenDoubles ? gender.female : gender.male

			const playersArray: IPlayer[] = [
				createNewPlayerObject(Number(match.home.id), match.home.name, matchGender, match.home.cc),
				createNewPlayerObject(Number(match.away.id), match.away.name, matchGender, match.away.cc),
			]

			if (tournament.type === type.menDoubles || tournament.type === type.womenDoubles) {
				const teamsPromises = playersArray.map(async (teamData, i) => {
					const teamDB = await config.database.services.getters.getPlayer(Number(teamData.api_id))

					if (teamDB !== null) {
						if (i === 0) {
							home = teamDB
						} else {
							away = teamDB
						}
					} else {
						const teamPlayers: IPlayer[] = []

						const team1Data = await config.api.services.getTeamMembers(teamData.api_id)

						const teamPlayersPromises = team1Data.map(async (player, j): Promise<void> => {
							if (player !== null) {
								const playerDB = await config.database.services.getters.getPlayer(Number(player.id))

								if (playerDB != null) {
									teamPlayers[j] = playerDB
								} else {
									const playerObject = createNewPlayerObject(Number(player.id), player.name, matchGender, player.cc)
									const savedPlayer = await config.database.services.savers.saveNewPlayer(playerObject)

									teamPlayers[j] = savedPlayer
								}
							}
						})

						await Promise.allSettled(teamPlayersPromises)

						const doublesPlayerObject: IDoublesPlayer = createNewDoublesPlayerObject(
							teamData.api_id,
							teamData.name,
							teamData.gender,
							teamData.cc,
							teamPlayers[0],
							teamPlayers[1],
						)

						const savedDoublesPlayer = await config.database.services.savers.saveNewPlayer(doublesPlayerObject)

						if (i === 0) {
							home = savedDoublesPlayer
						} else {
							away = savedDoublesPlayer
						}
					}
				})

				await Promise.allSettled(teamsPromises)
			} else if (tournament.type === type.davisCup) {
				const playersPromises = playersArray.map(async (player, j): Promise<void> => {
					const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

					if (playerDB != null) {
						if (j === 0) {
							home = playerDB
						} else {
							away = playerDB
						}
					} else {
						const savedPlayer = await config.database.services.savers.saveNewPlayer(playersArray[j])

						if (j === 0) {
							home = savedPlayer
						} else {
							away = savedPlayer
						}
					}
				})

				await Promise.allSettled(playersPromises)
			} else {
				const playersPromises = playersArray.map(async (player, j): Promise<void> => {
					const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

					if (playerDB != null) {
						if (j === 0) {
							home = playerDB
						} else {
							away = playerDB
						}
					} else {
						const savedPlayer = await config.database.services.savers.saveNewPlayer(playersArray[j])

						if (j === 0) {
							home = savedPlayer
						} else {
							away = savedPlayer
						}
					}
				})

				await Promise.allSettled(playersPromises)
			}

			if (eventView?.extra?.stadium_data !== undefined) {
				const courtDB = await config.database.services.getters.getCourt(Number(eventView.extra.stadium_data.id))

				if (courtDB !== null) {
					court = courtDB
				} else {
					const courtObject = createNewCourtObject(
						Number(eventView.extra.stadium_data.id),
						eventView.extra.stadium_data.name,
					)

					const savedCourt = await config.database.services.savers.saveNewCourt(courtObject)

					court = savedCourt
				}
			}

			if (match.bet365_id !== undefined) {
				const eventOdss = await config.api.services.getMatchOdds(Number(match.id))

				if (eventOdss.odds[config.api.constants.oddsMarketsRef.winner].length < 1) {
					pre_odds = getMatchPreOdds(eventOdss)
				}
			}

			if (home !== null && away !== null) {
				const preMatchObject = createNewPreMatchObject(
					Number(match.id),
					Number(match.bet365_id),
					Number(match.sport_id),
					tournament.type,
					match?.round,
					tournament,
					court,
					home,
					away,
					match.time_status,
					new Date(Number(match.time) * 1000),
					pre_odds,
				)

				const savedPreMatch = await config.database.services.savers.saveNewPreMatch(preMatchObject)

				newMatchesSaved.push(savedPreMatch)
			} else {
				logger.error(
					'There was an error trying to create a new pre match object due to problems with assignation of the players (promises not resolved on time)',
				)
			}
		}

		const finishDate = new Date()
		const duration = msToTime(finishDate.getTime() - startDate.getTime())
		logger.info(
			`${
				newMatchesSaved.length
			} matches have been saved - The process finished at: ${finishDate.toString()}, TOTAL DURATION :', ${duration}`,
		)
	} catch (err) {
		logger.error(err)
	}
}
