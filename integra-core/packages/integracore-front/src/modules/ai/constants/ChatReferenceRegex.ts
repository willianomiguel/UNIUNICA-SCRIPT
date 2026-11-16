import { CHAT_REFERENCE_BODY_PATTERN } from 'integracore-shared/ai';

export const CHAT_REFERENCE_REGEX = new RegExp(
  `\\[\\[(${CHAT_REFERENCE_BODY_PATTERN})\\]\\]`,
  'g',
);
