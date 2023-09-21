import type { Request, Response } from "express";
import config from "./config";


export const getMatchDetails = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const matchId = req.params.id
    
        const matchDetails = await config.database.services.getters.getPreMatch(Number(matchId))
    
        res.status(200).send(matchDetails)
    } catch (err) {
        res.status(402).send(err)
    }
}