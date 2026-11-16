import { type AiDataPolicy, type AiModelTier } from 'integracore-shared/ai';

import { type ClientAiModelTierConfig } from '~/generated-metadata/graphql';

export const findAiModelTierForDataPolicy = ({
  aiModelTiers,
  tier,
  aiDataPolicy,
}: {
  aiModelTiers: ClientAiModelTierConfig[];
  tier: AiModelTier;
  aiDataPolicy: Pick<
    AiDataPolicy,
    'requiredDataResidencyRegion' | 'isZeroDataRetentionRequired'
  >;
}): ClientAiModelTierConfig | undefined =>
  aiModelTiers.find(
    (aiModelTier) =>
      aiModelTier.tier === tier &&
      (aiModelTier.requiredDataResidencyRegion ?? null) ===
        aiDataPolicy.requiredDataResidencyRegion &&
      aiModelTier.isZeroDataRetentionRequired ===
        aiDataPolicy.isZeroDataRetentionRequired,
  );
