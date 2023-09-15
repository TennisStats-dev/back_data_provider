// import config from "@config/index"
// import logger from "@config/logger"
// import { getUpcomingMatchesApiData } from "./axios.services"
// import type { UpcomingMatches } from "types/fetchingRes/upcomingMatches"
// import { IPreMatch } from "types/schemas"

// export const getUpcomingMatches = async (): Promise<void> => {
    
//     const allUpcomingMatches: UpcomingMatches[] = []
//     const page = 1

    
//     do {
//         const apiResponse = await getUpcomingMatchesApiData()
//         if (apiResponse === null) return
//         const upcomingMatches: IPreMatch[] = apiResponse.results.map(match => {


//             return {
//                 api_id: match.id,
//                 bet365_id: match.bet365_id,
//                 sport_id: match.sport_id,
//                 type: 
//             }
//         })

//     } while {
//         allUpcomingMatches.length = 
//     }




//     allUpcomingMatches.push(upcomingMatches.results)

//     const totalMatches = upcomingMatches.pager.total

//     const fetchsNeeded = Math.round(totalMatches / config.api.resultsPerPage) - 1


//     for (let i = 2; i <= fetchsNeeded; i++) {
//         const new50UpcomingMatches = await getUpcomingMatchesApiData(i)
//         if (new50UpcomingMatches !== null) {
//             allUpcomingMatches.push(...new50UpcomingMatches.results)
//         }
//     }

//     logger.info(totalMatches)
//     logger.info(fetchsNeeded)
//     console.log(allUpcomingMatches.length)
// }