import logger from '@config/logger'
import https from 'https'
const url = 'https://back-data-provider.onrender.com'

export const selfPing = async (): Promise<undefined> => {
    let statusCode
    await new Promise(function (resolve, reject) {
        https.get(url, (res) => {
            statusCode = res.statusCode
            resolve(statusCode)
        }).on("error", (e) => {
            reject(e);
        })
    })
    logger.info(statusCode)
    return statusCode
}