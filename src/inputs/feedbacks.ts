import { Source } from '@linkbox/sdk'
import { sourceSelectField } from './fields'

export enum FeedbackType {
	Recording = 'recording',
}

export const getFeedbacks = (instance: any, sources: Source[]) => ({
	[FeedbackType.Recording]: {
		label: 'Change button color if recording is active',
		description: 'If there is an active recorder, set the button to this color',
		options: [
			{
				type: 'colorpicker',
				label: 'Foreground color',
				id: 'fg',
				default: instance.rgb(255, 255, 255),
			},
			{
				type: 'colorpicker',
				label: 'Background color',
				id: 'bg',
				default: instance.rgb(233, 70, 70),
			},
			sourceSelectField(sources),
		],
	},
})
