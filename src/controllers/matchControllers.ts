import logger from '@config/logger'
import type { Request, Response } from 'express'
import { type UpcomingMatches } from 'API/types/upcomingMatches'
import config from '@config/index'
import { gender, type } from 'constants/data'
import type { ICourt, IPlayer, IPreMatch, IPreOdds, ITeam, ITournament } from 'types/schemas'
import { createNewPreMatchObject, getMatchPreOdds } from 'services/match.services'
import { createNewPlayerObject } from 'services/player.services'
import { createNewCourtObject } from 'services/court.services'
import { createNewCompletTournamentObject, createNewIncompletTournamentObject } from 'services/tournament.services'
import { createNewTeamObject } from 'services/team.services'

export const saveUpcomingMatches = async (_req: Request, _res: Response): Promise<void> => {
	try {
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
        let p1: IPlayer | ITeam | null = null
        let p2: IPlayer | ITeam | null = null
        let court: ICourt | null = null
        let pre_odds: IPreOdds | null = null

        const tournamentDB = await config.database.services.getters.getTournament(Number(match.league.id))



        if (tournamentDB !== null) {
            tournament = tournamentDB
        } else if (eventView.extra !== undefined) {
         
            const tournamentObject = createNewCompletTournamentObject(
                Number(match.id),
                Number(match.league.id),
                match.league.name,
                match.home.name,
                match.away.name,
                eventView.extra?.bestofsets,
                eventView.extra?.ground,
                eventView.extra.stadium_data?.city,
                match.league.cc,
                eventView.extra.stadium_data?.country,
            )
            const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
            tournament = savedTournament
        
        } else {
            const tournamentObject = createNewIncompletTournamentObject(
                Number(match.id),
                Number(match.league.id),
                match.league.name,
                match.home.name,
                match.away.name,
                match.league.cc,
            )
            const savedTournament = await config.database.services.savers.saveNewTournament(tournamentObject)
            tournament = savedTournament
        
        }

        const matchGender =
            tournament.type === type.menDoubles || tournament.type === type.womenDoubles ? gender.female : gender.male

        const playersArray: IPlayer[] = [
            createNewPlayerObject(Number(match.home.id), match.home.name, matchGender, match.home.cc),
            createNewPlayerObject(Number(match.away.id), match.away.name, matchGender, match.away.cc),
        ]

   

        if (tournament.type === type.menDoubles || tournament.type === type.womenDoubles) {
            const teams: ITeam[] = []

            const teamsPromises = playersArray.map(async (teamData, i) => {

                const teamDB = await config.database.services.getters.getTeam(Number(teamData.api_id))

                if (teamDB !== null) {
                    teams[i] = teamDB
                } else {
                    const players: IPlayer[] = []

                    const team1Data = await config.api.services.getTeamMembers(teamData.api_id)


                    const teamPlayersPromises = team1Data.map(async (player, j): Promise<void> => {
                        if (player !== null) {
                            const playerDB = await config.database.services.getters.getPlayer(Number(player.id))
                            
                            if (playerDB != null) {
                                players[j] = playerDB
                            } else {
                                const playerObject = createNewPlayerObject(Number(player.id), player.name, matchGender, player.cc)
                                const savedPlayer = await config.database.services.savers.saveNewPlayer(playerObject)
                                players[j] = savedPlayer
                            }
                        }
                    })

                    await Promise.allSettled(teamPlayersPromises)

                    const teamObject: ITeam = createNewTeamObject(
                        teamData.api_id,
                        players[0],
                        players[1],
                    )

                    const savedTeam = await config.database.services.savers.saveNewTeam(teamObject)

                    teams[i] = savedTeam
                }
            })



            await Promise.allSettled(teamsPromises)

            p1 = teams[0]
            p2 = teams[1]
        } else if (tournament.type === type.men || tournament.type === type.women) {
            const players: IPlayer[] = []
            const playersPromises = playersArray.map(async (player, j): Promise<void> => {
                const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

                if (playerDB != null) {
                    players[j] = playerDB
                } else {
                    const savedPlayer = await config.database.services.savers.saveNewPlayer(playersArray[j])
                    players[j] = savedPlayer
                }
            })

            await Promise.allSettled(playersPromises)

            p1 = players[0]
            p2 = players[1]
        } else if (tournament.type === type.davisCup) {
            const players: IPlayer[] = []

            const playersPromises = playersArray.map(async (player, j): Promise<void> => {
                const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

                if (playerDB != null) {
                    players[j] = playerDB
                } else {
                    const savedPlayer = await config.database.services.savers.saveNewPlayer(playersArray[j])
                    players[j] = savedPlayer
                }
            })

            await Promise.allSettled(playersPromises)

            p1 = players[0]
            p2 = players[1]
        }

        if (eventView?.extra?.stadium_data !== undefined) {
            const courtDB = await config.database.services.getters.getCourt(Number(eventView.extra.stadium_data.id))

            if (courtDB !== null) {
                court = courtDB
            } else {
                const courtObject = createNewCourtObject(Number(eventView.extra.stadium_data.id), eventView.extra.stadium_data.name)

                const savedCourt = await config.database.services.savers.saveNewCourt(courtObject)

                court = savedCourt
            }
        } 

        if (match.bet365_id !== undefined) {
            const eventOdss = await config.api.services.getMatchOdds(Number(match.id))

            pre_odds = getMatchPreOdds(eventOdss)
        }

        if (p1 !== null && p2 !== null) {
            const preMatchObject = createNewPreMatchObject(
                Number(match.id),
                Number(match.bet365_id),
                Number(match.sport_id),
                match?.round,
                tournament,
                court,
                p1,
                p2,
                match.time_status,
                new Date(Number(match.time) * 1000),
                pre_odds
            )

            const savedPreMatch = await config.database.services.savers.saveNewPreMatch(preMatchObject)


            newMatchesSaved.push(savedPreMatch)
        } else {
            logger.error(
                'There was an error trying to create a new pre match object due to problems with assignation of the players (promises not resolved on time)',
            )
            }
    }
    
    console.log(`Ha habido un total de ${newMatchesSaved.length} partidos guardados`)
    console.log(newMatchesSaved)

	} catch (err) {
		logger.error(err)
	}
}
