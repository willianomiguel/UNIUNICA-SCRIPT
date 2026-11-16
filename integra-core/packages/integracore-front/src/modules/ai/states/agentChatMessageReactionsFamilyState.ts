import { type AgentMessageReactionSummary } from 'integracore-shared/ai';

import { createAtomFamilyState } from '@/ui/utilities/state/jotai/utils/createAtomFamilyState';

// Kept apart from the messages, which a stream or a refetch replaces wholesale
export const agentChatMessageReactionsFamilyState = createAtomFamilyState<
  AgentMessageReactionSummary[],
  { messageId: string }
>({
  key: 'agentChatMessageReactionsFamilyState',
  defaultValue: [],
});
