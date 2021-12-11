import { Source } from '@linkbox/sdk'

export const sourceSelectField = (sources: Source[]) => ({
	type: 'dropdown',
	label: 'Source',
	id: 'sourceId',
	choices: sources.map((source) => ({
		id: source.id,
		label: source.name,
	})),
})
