import { isNonEmptyString } from '@sniptt/guards';
import { type ExtendedUIMessagePart } from 'integracore-shared/ai';

export const hasReplyText = (parts: ExtendedUIMessagePart[]): boolean =>
  parts.some((part) => part.type === 'text' && isNonEmptyString(part.text));
