import { isDefined } from 'integracore-shared/utils';
import { type FullNameMetadata } from 'integracore-shared/types';

export const computeDisplayName = (
  name: FullNameMetadata | null | undefined,
) => {
  if (!name) {
    return '';
  }

  return Object.values(name).filter(isDefined).join(' ');
};
