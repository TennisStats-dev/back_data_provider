// import { Player, TempPlayer } from "@database/models/player.model"
// import type { IPlayer } from "types/schemas"
// import logger from '@config/logger'
// import { countriesCCArray } from "constants/countries"

// export const createPlayer = async (): Promise<void> => {
// 	try {
// 		const newPlayer1 = new Player<IPlayer>({
// 			api_id: 1,
// 			name: 'vega',
// 			gender: 'F',
// 			cc: 'es',
// 		})
// 		await newPlayer1.save()
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// export const saveNewTempPlayer = async ({name, api_id, gender, birth, image_id, cc}: IPlayer): Promise<void> => {    
//     const playerData: IPlayer = {
//         name,
//         api_id,
//         gender,
//     }

//     if(image_id !== (null ?? undefined ?? '')) {
//         logger.info('guarda la url de la imagen')
//         playerData.image_id = image_id
//     }

//     if(birth instanceof Date) {
//         logger.info('guarda la fecha')
//         playerData.birth = birth
//     }

//     if(cc !== undefined && countriesCCArray.includes(cc)) {
//         logger.info('guarda el pais')
//         playerData.cc = cc
//     }
    
    
//     const newTempPlayer = new TempPlayer(playerData)

//     const savedTempPlayer = await newTempPlayer.save()
    
//     if (savedTempPlayer !== undefined) {
//         logger.info('New temporal player created: name: ' + name + 'id: ' + api_id)
//     } else {
//         logger.error('Error trying to save a new temporal player. Name: ' + name + 'id: ' + api_id)
//     }
// }

// const date = new Date()

// const hanldeRequests = async (): Promise<void> => {
// 	const res = await checkIfCanProceed(date, 3501)
// 	if (res){
// 		await saveRequests(date, 1000)
// 	}
// }

// hanldeRequests()
// .then(_res => null)
// .catch(_err => logger.info(_err))

// createPlayer()
// 	.then((res) => logger.info(res))
// 	.catch((err) => logger.error(err))

// checkIfPlayerExists(1)
// .then((res) => logger.info(res))
// .catch((err) => logger.error(err))
// checkIfPlayerExists(2)
// .then((res) => logger.info(res))
// .catch((err) => logger.error(err))

// const newPlayer: IPlayer = {
// 	api_id: 1,
// 	name: 'vega',
// 	gender: 'F',
// 	cc: '',
// 	image_id: '',
// 	birth: ''
// }

// saveNewTempPlayer(newPlayer)
// .then((_res) => logger.info('res'))
// .catch((err) => logger.error(err))

// const addTournament = async (): Promise<void> => {
// 	const exists = await checkIfTournamentExists(1)

// 	const newtournament: ITournament = {
// 		api_id: 1,
// 		name: 'Roland garros',
// 		best_of_sets: 5,
// 		ground: 'clay',
// 		city: 'Paris',
// 		cc: 'fr'
// 	}

// 	if(!exists) {
// 		saveNewTournament(newtournament)
// 		.then((_res) => logger.info('tournament created'))
// 		.catch((err) => logger.error(err))
// 	}
// }

// addTournament()
// .then((_res) => logger.info('ok'))
// .catch((err) => logger.error(err))