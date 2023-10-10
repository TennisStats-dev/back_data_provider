import type { Request, Response } from "express";
import config from "./config";


export const getPreMatchDetails = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const matchId = req.params.id
    
        const matchDetails = await config.database.services.getters.getPreMatch(Number(matchId))
    
        res.status(200).send(matchDetails)
    } catch (err) {
        res.status(402).send(err)
    }
}

export const getEndedMatchDetails = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const matchId = req.params.id
    
        const matchDetails = await config.database.services.getters.getEndedMatch(Number(matchId))
    
        res.status(200).send(matchDetails)
    } catch (err) {
        res.status(402).send(err)
    }
}

export const getAllPlayerEndedMatchesDetails = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const playerId = req.params.id
    
        const matchesDetails = await config.database.services.getters.getAllPlayerEndedMatchesByApi_id(Number(playerId))
    
        res.status(200).send({total: matchesDetails?.length, results: matchesDetails})
    } catch (err) {
        res.status(402).send(err)
    }
}



