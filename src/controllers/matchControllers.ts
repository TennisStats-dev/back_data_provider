import { createNewPreMatchObject } from 'services/match.services'
import type { Request, Response } from 'express'
import { type UpcomingMatches } from 'API/types/upcomingMatches'
import { gender, type } from 'constants/data'
import config from '@config/index'
import { createNewPlayerObject } from 'services/player.services'
import type { ICourt, IPlayer, ITeam, ITournament } from 'types/schemas'
import { createNewCourtObject } from 'services/court.services'
import logger from '@config/logger'
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
			console.log('upcoming matches es', allUpcomingMatches.length)
		} while (allUpcomingMatches.length < upcomingMatchesApiResponse.pager.total)

        

		for (const match of allUpcomingMatches) {

            console.log('se itera un nuevo partido!!')
        
        if ((await config.database.services.getters.getPreMatch(Number(match.id))) !== null) {
            continue
        }

        const eventView = await config.api.services.getEventView(Number(match.id))

        let tournament: ITournament
        let p1: IPlayer | ITeam | null = null
        let p2: IPlayer | ITeam | null = null
        let court: ICourt | null = null

        const tournamentDB = await config.database.services.getters.getTournament(Number(match.league.id))



        if (tournamentDB !== null) {
            tournament = tournamentDB
        } else if (eventView.extra !== undefined) {
            console.log('se accede a crerar torneo completo')
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
            console.log('torneo guardado')
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
            console.log('torneo incpmpleto guardado')
        }

        const matchGender =
            tournament.type === type.menDoubles || tournament.type === type.womenDoubles ? gender.female : gender.male

        const playersArray: IPlayer[] = [
            createNewPlayerObject(Number(match.home.id), match.home.name, matchGender, match.home.cc),
            createNewPlayerObject(Number(match.away.id), match.away.name, matchGender, match.away.cc),
        ]

        console.log()

        if (tournament.type === type.menDoubles || tournament.type === type.womenDoubles) {
            const teams: ITeam[] = []

            const teamsPromises = playersArray.map(async (teamData, i) => {

                console.log('se inicia el array de promesas para guardar team')
                console.log('el id del team es ', teamData.api_id)
                const teamDB = await config.database.services.getters.getTeam(Number(teamData.api_id))

                console.log('Se ejecuta get team para recuperar datos de las players del team :', teamDB)

                if (teamDB !== null) {
                    teams[i] = teamDB
                } else {
                    const players: IPlayer[] = []

                    const team1Data = await config.api.services.getTeamMembers(teamData.api_id)

                    console.log('se ejecuta getTeamMembers y los id recibidos son: ', team1Data[0]?.id, ' y ',  team1Data[1]?.id)

                    const teamPlayersPromises = team1Data.map(async (player, j): Promise<void> => {


                        console.log('se empieza a crear jugadores de equipo')

                        if (player !== null) {
                            const playerDB = await config.database.services.getters.getPlayer(Number(player.id))
                            
                            if (playerDB != null) {
                                players[j] = playerDB
                            } else {
                                const playerObject = createNewPlayerObject(Number(player.id), player.name, matchGender, player.cc)
                                const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playerObject)
                                players[j] = savedPlayer
                            }
                        }
                    })

                    await Promise.allSettled(teamPlayersPromises)

                    console.log('EL array con los jugadores guardados es :', players)

                    const teamObject: ITeam = createNewTeamObject(
                        teamData.api_id,
                        players[0],
                        players[1],
                    )

                    const savedTeam = await config.database.services.savers.saveNewTempTeam(teamObject)

                    teams[i] = savedTeam
                }
            })



            const resolvedPromises = await Promise.allSettled(teamsPromises)


            console.log('Las promesas resueltas son: ', resolvedPromises)

            p1 = teams[0]
            p2 = teams[1]
        } else if (tournament.type === type.men || tournament.type === type.women) {
            const players: IPlayer[] = []
            console.log('se inicia array de promesas para guardar partido indiv')
            const playersPromises = playersArray.map(async (player, j): Promise<void> => {
                const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

                if (playerDB != null) {
                    players[j] = playerDB
                } else {
                    const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playersArray[j])
                    players[j] = savedPlayer
                }
            })

            const playerspromiseResolved =await Promise.allSettled(playersPromises)

            console.log('promesa jugadores guardados', playerspromiseResolved)

            p1 = players[0]
            p2 = players[1]
        } else if (tournament.type === type.davisCup) {
            const players: IPlayer[] = []

            const playersPromises = playersArray.map(async (player, j): Promise<void> => {
                const playerDB = await config.database.services.getters.getPlayer(Number(player.api_id))

                if (playerDB != null) {
                    players[j] = playerDB
                } else {
                    const savedPlayer = await config.database.services.savers.saveNewTempPlayer(playersArray[j])
                    players[j] = savedPlayer
                }
            })

            const playerspromiseResolved = await Promise.allSettled(playersPromises)

            console.log('promesa jugadores guardados', playerspromiseResolved)

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

        console.log(match.round)

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
            )

            console.log('el partido a guardar es: ', preMatchObject)

            await config.database.services.savers.saveNewPreMatch(preMatchObject)

            console.log('partido guardado correctamente')
        } else {
            logger.error(
                'There was an error trying to create a new pre match object due to problems with assignation of the players (promises not resolved on time)',
            )
        }
		// allUpcomingMatches.map(async match => {	
    }
        // })


	} catch (err) {
		logger.error(err)
	}
}
