import { isDefined } from 'integracore-shared/utils';

import { type AiChatUsage } from '@/ai/types/AiChatUsage';

export const isAiChatUsageLimitReached = (usage: AiChatUsage | null): boolean =>
  isDefined(usage) &&
  usage.kind === 'limit' &&
  isDefined(usage.consumedValue) &&
  usage.consumedValue >= usage.limitValue;
