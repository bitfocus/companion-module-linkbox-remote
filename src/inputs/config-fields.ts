export type InstanceConfig = {
  apiUrl: string;
  apiToken: string;
};

export const configFields = [
  {
    type: 'text',
    id: 'info',
    width: 12,
    label: 'Setup Information',
    value: 'You need a linkbox instance in your local network',
  },
  {
    type: 'textinput',
    id: 'apiUrl',
    width: 12,
    label: 'API URL',
  },
  {
    type: 'textinput',
    id: 'apiToken',
    width: 12,
    label: 'API TOKEN',
  },
];
