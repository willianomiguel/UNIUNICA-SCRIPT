import { type RunAgentResult } from 'integracore-sdk/logic-function';

export type SlackAssistantAgentRunResult =
  | RunAgentResult
  | { threadId: null; result: null; error: string; success: false };
