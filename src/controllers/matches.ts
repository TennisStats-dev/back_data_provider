import Court from '@database/models/court.model'
import Match from '@database/models/match.model'
import Player from '@database/models/player.model'
import PreMatch from '@database/models/preMatch.model'
import Team from '@database/models/team.model'
import Tournament from '@database/models/tournament.model'
// import Team from '@database/models/team.model'
import type {
	ITeam,
	IPlayer,
	ICourt,
	ITournament,
	IPreMatch,
	IMatch,
} from 'types/schemas'

export const createPlayer = (async (): Promise<string> => {
	try {
		const newPlayer1 = new Player<IPlayer>({
			api_id: 1,
			name: 'vega',
			gender: 'F',
			cc: 'es',
		})
		const newPlayer2 = new Player<IPlayer>({
			api_id: 2,
			name: 'Judit',
			gender: 'F',
			cc: 'es',
		})

		const newTeam = new Team<ITeam>({
			api_id: 3,
			team_p1: newPlayer1,
			team_p2: newPlayer2,
		})

		const newCourt = new Court<ICourt>({
			api_id: 5,
			name: 'Philip Chatrie',
		})

		const newTournament = new Tournament<ITournament>({
			api_id: 6,
			name: 'Roland Garros',
			best_of_sets: 5,
			ground: 'clay',
			city: 'Paris',
			cc: 'fr',
		})

		const newPreMatch = new PreMatch<IPreMatch>({
			api_id: 9,
			bet365_id: 8,
			sport_id: 13,
			type: 'W',
			round: 'F',
			tournament: newTournament,
			court: newCourt,
			p1: newPlayer1,
			p2: newPlayer2,
			status: 0,
			est_time: new Date(),
		})

		const newMatch = new Match<IMatch>({
			api_id: 10,
			bet365_id: 8,
			sport_id: 13,
			type: 'W',
			round: 'F',
			tournament: newTournament,
			court: newCourt,
			p1: newPlayer1,
			p2: newPlayer2,
			status: 0,
			est_time: new Date(),
			b365_start_time: new Date(),
			b365_end_time: new Date(),
			match_stats: {
				result: ['6-4', '7-5'],
				aces: [5, 0],
				df: [3, 0],
				win_1st_serve: [50, 60],
				bp: [50, 40],
			},
			sets_stats: [
				{
					number: 1,
					games_stats: [
						{
							summary: 'hold to 30',
							consistency: 2,
							service: 1,
							winner: 1,
							won_points: [4, 2],
							total_bp: 0,
							total_aces: 1,
							points: [
								{
									result: '15-0',
								},
							],
						},
					],
				},
			],
		})

		await newPlayer1.save()
		await newPlayer2.save()
		await newTeam.save()
		await newCourt.save()
		await newTournament.save()
		await newPreMatch.save()
		await newMatch.save()

		return 'Everything created succesfully'
	} catch (err) {
		console.log(err)
		return 'Error to create a new player'
	}
})()
