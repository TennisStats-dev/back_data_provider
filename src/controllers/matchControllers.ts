// import { getMatchType } from 'services/match.services'
// import type { Request, Response } from 'express'
// import { type UpcomingMatches } from 'API/types/upcomingMatches'
// import { gender, pOption } from 'constants/data'
// import config from '@config/index'
// import { createNewPlayerObject } from 'services/player.services'
// import type { ICourt, IPlayer, ITeam, ITournament } from 'types/schemas'
// import { createNewTeamObject } from 'services/team.services'
// import { markRaw } from 'vue'

// export const saveUpcomingMatches = async (_req: Request, _res: Response): Promise<void> => {
// 	try {
// 		const allUpcomingMatches: UpcomingMatches[] = []
// 		let page = 1

// 		const upcomingMatchesApiResponse = await config.api.services.getUpcomingMatches(page)
// 		allUpcomingMatches.push(...upcomingMatchesApiResponse.results)

// 		do {
// 			page += 1
// 			const apiResponse = await config.api.services.getUpcomingMatches(page)
// 			allUpcomingMatches.push(...apiResponse.results)
// 			console.log('upcoming matches es', allUpcomingMatches.length)
// 		} while (allUpcomingMatches.length < upcomingMatchesApiResponse.pager.total)

// 		allUpcomingMatches.map(async (match) => {
// 			const matchId = Number(match.id)

// 			if ((await config.database.services.getters.getPreMatch(matchId)) !== null) {
// 				return
// 			}

// 			const matchType = getMatchType(match.home.name, match.away.name, match.league.name, Number(match.league.id))
// 			const matchGender = matchType.type === 'MD' || matchType.type === 'WD' ? gender.female : gender.male

// 			let tournament: ITournament
// 			let p1: IPlayer | ITeam
// 			let p2: IPlayer | ITeam
// 			let court_id: ICourt

// 			const playersArray: IPlayer[] = [
// 				createNewPlayerObject(Number(match.home.id), match.home.name, matchGender, match.home.cc),
// 				createNewPlayerObject(Number(match.away.id), match.away.name, matchGender, match.away.cc),
// 			]

// 			if (matchType.type === 'MD' || matchType.type === 'WD') {
// 				const teamsPromises = playersArray.map(async (teamData, i) => {
// 					const teamDB = await config.database.services.getters.getTeam(Number(teamData.api_id))

// 					if (teamDB !== null) {
// 						if (i === 0) {
// 							p1 = teamDB
// 						} else {
// 							p2 = teamDB
// 						}
// 					} else {
// 						const players: IPlayer[] = []

// 						const team1Data = await config.api.services.getTeamMembers(teamData.api_id)

// 						const teamPlayersPromises = team1Data.map(async (player, j): Promise<void> => {
// 							const playerDB = await config.database.services.getters.getPlayer(Number(player.id))

// 							if (playerDB != null) {
// 								players[j] = playerDB
// 							} else {
// 								const playerObject = createNewPlayerObject(Number(player.id), player.name, matchGender, player.cc)
// 								const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playerObject)
// 								players[j] = savedPlayer
// 							}
// 						})

// 						await Promise.allSettled(teamPlayersPromises)

// 						const teamObject: ITeam = {
// 							api_id: teamData.api_id,
// 							team_p1: players[0],
// 							team_p2: players[1],
// 						}

// 						const teamDB = await config.database.services.savers.saveNewTempTeam(teamObject)

// 						if (i === 0) {
// 							p1 = teamDB
// 						} else {
// 							p2 = teamDB
// 						}
// 					}
// 				})

//                 await Promise.allSettled(teamsPromises)

// 			} else if (matchType.type === 'M' || matchType.type === 'W') {
// 				const players: IPlayer[] = []

// 				const playersPromises = playersArray.map(async (player, j): Promise<void> => {
// 					const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

// 					if (playerDB != null) {
// 						players[j] = playerDB
// 					} else {
// 						const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playersArray[j])
// 						players[j] = savedPlayer
// 					}
// 				})

// 				await Promise.allSettled(playersPromises)

// 				p1 = players[0]
// 				p2 = players[1]
// 			} else if (matchType.type === 'DC') {
// 				const players: IPlayer[] = []

// 				const playersPromises = playersArray.map(async (player, j): Promise<void> => {
// 					const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

// 					if (playerDB != null) {
// 						players[j] = playerDB
// 					} else {
// 						const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playersArray[j])
// 						players[j] = savedPlayer
// 					}
// 				})

// 				await Promise.allSettled(playersPromises)

// 				p1 = players[0]
// 				p2 = players[1]
// 			}

//             const tournamentDB = await config.database.services.getters.getTournament(Number(match.league.id))
            
//             if(tournamentDB !== null) {
//                 tournament = tournamentDB
//             } else {
//                 const tournamentObject = crea
//             }
// 		})
// 	} catch (err) {
// 		console.log(err)
// 	}
// }
