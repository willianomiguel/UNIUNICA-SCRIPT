import { isDefined } from 'integracore-sdk/utils';

import { readOptionalString } from 'src/logic-functions/utils/read-optional-string.util';

export const toEpochSeconds = (value: unknown): number | undefined => {
  const text = readOptionalString(value);

  if (!isDefined(text)) {
    return undefined;
  }

  const milliseconds = Date.parse(text);

  return Number.isNaN(milliseconds)
    ? undefined
    : Math.floor(milliseconds / 1000);
};
