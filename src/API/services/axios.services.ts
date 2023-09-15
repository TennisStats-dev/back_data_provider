import logger from "@config/logger"
import config from "@config/index"
import axios from "axios"
import type { UpcomingMatches } from "types/fetchingRes/upcomingMatches"

export const getUpcomingMatchesApiData = async (page: number = 1): Promise<UpcomingMatches | null> => {
    try {
        const res = await axios.get(
            `${config.api.baseURL.upcomingMatches}`,
            {
                params: {
                    [config.api.paramKeys.token]: config.api.paramValues.token,
                    [config.api.paramKeys.sport_id]: config.api.paramValues.tennisID,
                    [config.api.paramKeys.page]: page,
                }
            }
        )
        const upcomingMatches: UpcomingMatches = res.data

        return upcomingMatches
    } catch (err) {
        logger.error(err)
        return null
    }
}