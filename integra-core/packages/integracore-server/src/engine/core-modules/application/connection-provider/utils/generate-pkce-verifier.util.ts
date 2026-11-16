import { randomBytes } from 'crypto';

import { base64UrlEncode } from 'integracore-shared/utils';

export const generatePkceVerifier = (): string =>
  base64UrlEncode(randomBytes(32));
