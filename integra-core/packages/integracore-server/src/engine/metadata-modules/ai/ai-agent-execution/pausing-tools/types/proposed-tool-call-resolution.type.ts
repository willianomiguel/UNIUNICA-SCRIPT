import { type ProposedToolCall } from 'integracore-shared/ai';

export type ProposedToolCallResolution =
  | { proposal: ProposedToolCall }
  | { error: string };
