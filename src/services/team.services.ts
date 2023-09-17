import config from '@config/index'
import type { IPlayer, ITeam } from 'types/schemas'
import { checkArrayIncludesSubstring } from 'utils/checkArrayIncludesSubstring'

export const checkIfIsTeam = (teamName: string): boolean => {
	return checkArrayIncludesSubstring(config.api.formats.Team, teamName)
}

export const createNewTeamObject = (api_id: number, team_p1: IPlayer, team_p2: IPlayer): ITeam => {
	const teamData: ITeam = {
		api_id,
		team_p1,
		team_p2,
	}

	return teamData
}
