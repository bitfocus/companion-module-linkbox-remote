import { Source } from 'linkbox-sdk';
import { sourceSelectField } from './fields';

export enum ActionType {
  StartRecording = 'startRecording',
}

export const getActions = (sources: Source[]) => ({
  [ActionType.StartRecording]: {
    label: 'Start recording',
    options: [
      sourceSelectField(sources),
      {
        type: 'textinput',
        label: 'Duration in seconds',
        id: 'duration',
        default: '10000',
      },
    ],
  },
});
