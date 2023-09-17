import logger from '@config/logger'
import { countriesCCArray } from 'constants/countries'


const validateCC = (cc: string | null): boolean => {

    if (cc === undefined || cc === null) {
        return false
    } else if (!countriesCCArray.includes(cc)) {
        logger.warn(`There is a new CC not stored - CC: ${cc}`)
        return true
    } else {
        return true
    }
}

const validatebirth = (birth: Date | undefined | string): boolean => {
	return birth instanceof Date
}

const validateImageId = (image: string | undefined): boolean => {
	return image !== (null ?? undefined ?? '')
}

export const validateAtribute = {
	cc: validateCC,
	birth: validatebirth,
	image: validateImageId,
}
