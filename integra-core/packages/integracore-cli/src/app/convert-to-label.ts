import startCase from 'lodash.startcase';
import { capitalize } from 'integracore-shared/utils';

export const convertToLabel = (name: string): string =>
  capitalize(startCase(name).toLowerCase());
