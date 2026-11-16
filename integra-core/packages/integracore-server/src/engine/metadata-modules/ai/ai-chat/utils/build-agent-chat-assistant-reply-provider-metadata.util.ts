import { isDefined } from 'integracore-shared/utils';

import { type AgentChatAssistantReplyContext } from 'src/engine/metadata-modules/ai/ai-chat/types/agent-chat-assistant-reply-context.type';

export const buildAgentChatAssistantReplyProviderMetadata = (
  context: AgentChatAssistantReplyContext | undefined,
) => {
  if (!isDefined(context)) {
    return undefined;
  }

  return {
    integracore: {
      assistantReplyContext: {
        isAssistantMentioned: context.isAssistantMentioned,
        isDirectAssistantChat: context.isDirectAssistantChat,
        isStructuredRequestContinuation:
          context.isStructuredRequestContinuation,
      },
    },
  };
};
