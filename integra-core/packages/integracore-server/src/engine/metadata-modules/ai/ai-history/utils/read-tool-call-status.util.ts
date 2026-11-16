import { isPlainObject } from 'integracore-shared/utils';

export const readToolCallStatus = (toolOutput: unknown): unknown =>
  isPlainObject(toolOutput) && isPlainObject(toolOutput.result)
    ? toolOutput.result.status
    : undefined;
