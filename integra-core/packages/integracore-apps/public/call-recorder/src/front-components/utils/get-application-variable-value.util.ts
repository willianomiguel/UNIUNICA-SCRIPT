import { getApplicationVariable } from 'integracore-sdk/front-component';

export const getApplicationVariableValue = (variableKey: string): string =>
  getApplicationVariable(variableKey) ?? '';
