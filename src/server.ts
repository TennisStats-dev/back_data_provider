import { app } from "index"
import config from "@config/config"

config.connectDB()

app.listen(config.server.port, () => {
	console.log(`Server running on port ${config.server.port}`)
})