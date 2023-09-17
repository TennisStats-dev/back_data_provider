const BASE_URLS = {
	upcomingMatches: process.env.API_UPCOMING_MATCHES_URL,
	endedMatches: process.env.API_ENDED_MATCHES_URL,
	matchView: process.env.API_MATCH_VIEW_URL,
	matchOdds: process.env.API_MATCH_ODDS_URL,
	teamMembers: process.env.API_TEAM_INFO_URL,
}

const PARAM_KEYS = {
	token: 'token',
	sport_id: 'sport_id',
	page: 'page',
	team_id: 'team_id',
	event_id: 'event_id',
}

const PARAM_VALUES = {
	token: process.env.API_TOKEN,
	tennisID: 13,
}

export const ENDPOINTS = {
	baseURLs: BASE_URLS,
	params: {
		keys: PARAM_KEYS,
		values: PARAM_VALUES,
	},
}
