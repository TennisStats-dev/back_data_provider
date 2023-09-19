import config from '@config/index'
import type { IPlayer, ITeam } from 'types/schemas'
import { checkIfArrayIncludesSubstring } from 'utils/checkArrayIncludesSubstring'

export const checkIfIsTeam = (teamName: string): boolean => {
	return checkIfArrayIncludesSubstring(config.api.formats.Team, teamName)
}

export const createNewTeamObject = (api_id: number, team_p1: IPlayer | null, team_p2: IPlayer | null): ITeam => {
	const teamData: ITeam = {
		api_id,
	}

	if (team_p1 !== null) {
		teamData.team_p1 = team_p1
	}

	if (team_p2 !== null) {
		teamData.team_p2 = team_p2
	}

	return teamData
}
