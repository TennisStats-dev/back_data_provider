interface Info {
	api_id?: number
	collection: string
}

export const createError = (err: any, process: string, info?: Info): Error => {
	if (err.response !== undefined) {
		return new Error(
			`ERROR: ${process} | TYPE: API | FETCHING ERROR: ${err.response.data.error} -- CODE: ${err.code} -- STATUS: ${err.response.status} -- ENDPOINT: ${err.request.path}`,
		)
	} else if (err.code !== undefined) {
		if (info !== undefined) {
			return new Error(
				`ERROR: ${process} | TYPE: DB | INFO: collection: ${info.collection} - id: ${info.api_id} | DETAILS: ${err}`,
			)
		} else {
			return new Error(`ERROR: ${process} | TYPE: DB | DETAILS: ${err}`)
		}
	} else {
		return new Error(`ERROR: ${process} `)
	}
}
