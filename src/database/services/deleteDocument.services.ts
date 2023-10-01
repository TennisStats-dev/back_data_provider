import logger from "@config/logger"
import PreMatch from "@database/models/preMatch.model"

const deletePreMatch = async (api_id: number): Promise<boolean> => {
        try {
            const isDeteleted = await PreMatch.deleteOne({
                api_id,
            })
    
            return isDeteleted.acknowledged
        } catch (err) {
            console.log(err)
            logger.error("Error deleting a pre match")
            throw new Error("Error deleting a pre match")
        }
    }

    const DELETE = {
        deletePreMatch
    }

    export default DELETE