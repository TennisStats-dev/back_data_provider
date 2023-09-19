import type { ICourt } from 'types/schemas'

export const createNewCourtObject = (api_id: number, name: string): ICourt => {
	const court = {
		api_id,
		name,
	}

	return court
}
