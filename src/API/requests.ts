const REQ_HOUR_CAP = 3600

// Used while development bescause I'll be consuming requests aswell
const MAX_REQ_TO_PROCEED = REQ_HOUR_CAP - 100

const WARN_FROM = REQ_HOUR_CAP - 150

export const REQUESTS = {
    Cap: REQ_HOUR_CAP,
    maxToProceed: MAX_REQ_TO_PROCEED,
    limitToWarn: WARN_FROM
}