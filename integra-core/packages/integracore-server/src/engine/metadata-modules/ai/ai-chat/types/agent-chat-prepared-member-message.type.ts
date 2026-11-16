import { type ExtendedUIMessagePart } from 'integracore-shared/ai';

export type AgentChatPreparedMemberMessage = {
  id?: string;
  text: string;
  parts: ExtendedUIMessagePart[];
};
