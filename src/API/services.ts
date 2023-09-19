import config from '@config/index'
import axios from 'axios'
import type { MatchView, MatchViewRes } from 'API/types/MatchView'
import type { TeamMembers, TeamMembersRes } from 'API/types/teamMembers'
import type { UpcomingMatchesRes } from 'API/types/upcomingMatches'
import { createError } from 'utils/createError'

const getUpcomingMatches = async (page: number = 1): Promise<UpcomingMatchesRes> => {
	try {
		const res = await axios.get(`${config.api.endpoints.baseURLs.upcomingMatches}`, {
			params: {
				[config.api.endpoints.params.keys.token]: config.api.endpoints.params.values.token,
				[config.api.endpoints.params.keys.sport_id]: config.api.endpoints.params.values.tennisID,
				[config.api.endpoints.params.keys.page]: page,
			},
		})
		const upcomingMatches: UpcomingMatchesRes = res.data
	
		return upcomingMatches
	} catch (err) {
		throw createError(err, 'get upcoming matches')
	}
}

const getEventView = async (api_id: number): Promise<MatchView> => {
	try {
		const res = await axios.get(`${config.api.endpoints.baseURLs.matchView}`, {
			params: {
				[config.api.endpoints.params.keys.token]: config.api.endpoints.params.values.token,
				[config.api.endpoints.params.keys.event_id]: api_id,
			},
		})

		const data: MatchViewRes = res.data

		const matchView: MatchView = data.results[0]
		return matchView
	} catch (err) {
		throw createError(err, 'get event view')
	}
}

const getTeamMembers = async (teamApiId: number): Promise<TeamMembers[]> => {
	try {
		const res = await axios.get(`${config.api.endpoints.baseURLs.teamMembers}`, {
			params: {
				[config.api.endpoints.params.keys.token]: config.api.endpoints.params.values.token,
				[config.api.endpoints.params.keys.team_id]: teamApiId,
			},
		})
	
		const data: TeamMembersRes = res.data
	
		const teamMember: TeamMembers[] = data.results
	
		return teamMember

	} catch (err) {
		throw createError(err, 'get team members')

	}
}

export const SERVICES = {
	getUpcomingMatches,
	getEventView,
	getTeamMembers,
}
