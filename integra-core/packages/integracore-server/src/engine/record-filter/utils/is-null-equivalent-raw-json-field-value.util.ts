import { isNull } from '@sniptt/guards';
import { isEmptyObject } from 'integracore-shared/utils';

export const isNullEquivalentRawJsonFieldValue = (value: unknown): boolean => {
  if (isNull(value)) {
    return true;
  }

  return isEmptyObject(value);
};
