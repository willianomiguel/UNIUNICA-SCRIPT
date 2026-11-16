import { type AiDataPolicy, type AiModelTier } from 'integracore-shared/ai';

export type WorkspaceAiModelSettings = {
  effectiveAiDataPolicy: AiDataPolicy;
  isAutoModelSelectionEnabled: boolean;
  aiModelIdByTier: Partial<Record<AiModelTier, string>>;
  aiChatModelTier: AiModelTier;
  aiAgentModelTier: AiModelTier;
};
