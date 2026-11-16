import { type RunAgentInput } from 'integracore-sdk/logic-function';

export type SlackAssistantAgentMessage = NonNullable<
  RunAgentInput['messages']
>[number];
