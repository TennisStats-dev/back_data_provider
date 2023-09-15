import { countriesCCArray } from "constants/countries";
import type { CountriesCC } from "types/schemas";

const validateCC = (cc: CountriesCC | undefined | string): boolean => {
    return cc !== undefined && countriesCCArray.includes(cc)
} 

const validatebirth = (birth: Date | undefined | string): boolean => {
    return birth instanceof Date
} 

const validateImageId = (image_id: string | undefined): boolean => {
    return image_id !== (null ?? undefined ?? '')
} 

export const validateAtribute = {
    cc: validateCC,
    birth: validatebirth,
    image_id: validateImageId,
}