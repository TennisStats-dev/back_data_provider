import MONGO from "./config"
import { SERVICES } from "./services"

const MONGODB = {
    connection: MONGO,
    services: SERVICES
}

export default MONGODB