
export const checkArrayIncludesSubstring = (formatsArray: string[], string: string): boolean => {
    let result = false
    
    formatsArray.forEach(format => {
        if (string.includes(format)) {
            result = true
        }
    })
    
    return result
}