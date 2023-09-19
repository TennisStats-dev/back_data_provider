export const checkIfArrayIncludesSubstring = (formatsArray: string[], stringToCheck: string): boolean => {
    return formatsArray.some(format => {
        return stringToCheck.includes(format)
    })
}


