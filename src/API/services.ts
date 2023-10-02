import config from '@config/index'
import axios from 'axios'
import type { MatchView, MatchViewRes } from '@API/types/MatchView'
import type { TeamMembers, TeamMembersRes } from '@API/types/teamMembers'
import type { UpcomingMatchesRes } from '@API/types/upcomingMatches'
import type { EventOdds, EventOddsRes } from './types/eventOdds'
import { createError } from '@utils/createError'
import type { EndedMatchesRes } from './types/endedMatches'

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

const getEndedMatches = async (page: number = 1): Promise<EndedMatchesRes> => {
	try {
		const res = await axios.get(`${config.api.endpoints.baseURLs.endedMatches}`, {
			params: {
				[config.api.endpoints.params.keys.token]: config.api.endpoints.params.values.token,
				[config.api.endpoints.params.keys.sport_id]: config.api.endpoints.params.values.tennisID,
				[config.api.endpoints.params.keys.page]: page,
			},
		})

		const endedMatches: EndedMatchesRes = res.data

		return endedMatches
	} catch (err) {
		console.log(err)
		throw createError(err, 'get ended matches')
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

const getMatchOdds = async (api_id: number): Promise<EventOdds> => {
	try {
		const res = await axios.get(`${config.api.endpoints.baseURLs.matchOdds}`, {
			params: {
				[config.api.endpoints.params.keys.token]: config.api.endpoints.params.values.token,
				[config.api.endpoints.params.keys.event_id]: api_id,
			},
		})

		const data: EventOddsRes = res.data

		const matchOdds: EventOdds = data.results

		return matchOdds
	} catch (err) {
		throw createError(err, 'get team members')
	}
}



export const SERVICES = {
	getUpcomingMatches,
	getEventView,
	getTeamMembers,
	getMatchOdds,
	getEndedMatches
}
