import config from "@config/index"
import type { IDoublesPlayer, IPlayer, IResultIssue, IStatusIssue } from "types/types"
import { getMatchStatus } from "./match.services"

export const saveResultIssue = async (
	details: string,
	status: string,
	matchId: number,
	home: IPlayer | IDoublesPlayer,
	away: IPlayer | IDoublesPlayer,
): Promise<void> => {

	const existingIssue = await config.database.services.getters.getEndedMatchesResultIssue(matchId)

	if (existingIssue !== null) {
		return
	}

	const resultIssueObject: IResultIssue = {
		matchId,
		home,
		away,
		status: getMatchStatus(Number(status), matchId),
		details,
	}
	await config.database.services.savers.saveNewResultIssue(resultIssueObject)
}

export const saveMatchToBeFixedIssue = async (
    matchId: number,
    home_name: string,
    away_name: string,
    status: string,
    est_time: Date,
): Promise<void> => {
	const existingIssue = await config.database.services.getters.getEndedMatchesStatusIssue(matchId)

    if (existingIssue !== null) {
		return
	}

    const statusIssueObject: IStatusIssue = {
		matchId,
		home_name,
		away_name,
		status: getMatchStatus(Number(status), matchId),
		est_time,
	}
	await config.database.services.savers.saveNewStatusIssue(statusIssueObject)
}