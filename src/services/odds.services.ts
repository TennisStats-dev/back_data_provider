import type { EventOdds } from '@API/types/eventOdds'
import config from '@config/index'
import type { IPreOdds } from 'types/types'

const getMatchPreOdds = (eventOddsInput: EventOdds): IPreOdds => {
	const winnerObject = eventOddsInput.odds[config.api.constants.oddsMarketsRef.winner]

	const firstSetWinnerObject = eventOddsInput.odds[config.api.constants.oddsMarketsRef.firstSetWinner]

	const preMatchOddsObject: IPreOdds = {
		first: {
			win: [winnerObject[winnerObject.length - 1]?.home_od, winnerObject[winnerObject.length - 1]?.away_od],
			time: new Date(Number(winnerObject[winnerObject.length - 1].add_time) * 1000),
		},
		last: {
			win: [winnerObject[0].home_od, winnerObject[0].away_od],
			update: new Date(Number(winnerObject[0].add_time) * 1000),
		},
	}

	if (eventOddsInput.odds[config.api.constants.oddsMarketsRef.firstSetWinner].length > 0) {
		preMatchOddsObject.first.win_1st_set = [
			firstSetWinnerObject[winnerObject.length - 1]?.home_od,
			firstSetWinnerObject[winnerObject.length - 1]?.away_od,
		]

		preMatchOddsObject.last.win_1st_set = [firstSetWinnerObject[0].home_od, firstSetWinnerObject[0].away_od]
	}

	return preMatchOddsObject
}

export const preMatchOddsHandler = async (bet365Id: number, matchId: number): Promise<IPreOdds | null> => {
	if (bet365Id !== undefined) {
		const eventOdss = await config.api.services.getMatchOdds(Number(matchId))

		if (
			eventOdss?.stats?.matching_dir !== undefined &&
			eventOdss.odds[config.api.constants.oddsMarketsRef.winner] !== undefined &&
			eventOdss.odds[config.api.constants.oddsMarketsRef.winner].length > 0
		) {
			return getMatchPreOdds(eventOdss)
		}
	}

	return null
}
