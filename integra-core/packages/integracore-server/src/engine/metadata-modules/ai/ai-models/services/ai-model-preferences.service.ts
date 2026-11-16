import { Injectable } from '@nestjs/common';

import { type AiModelTier } from 'integracore-shared/ai';

import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { AI_MODELS_DEFAULT_CONFIG_KEY_BY_TIER } from 'src/engine/metadata-modules/ai/ai-models/constants/ai-models-default-config-key-by-tier.constant';

@Injectable()
export class AiModelPreferencesService {
  constructor(private readonly integracoreConfigService: IntegraCoreConfigService) {}

  getDisabledModelIds(): string[] {
    return this.integracoreConfigService.get('AI_MODELS_DEFAULT_DISABLED');
  }

  getDefaultModelIdsForTier(tier: AiModelTier): string[] {
    return this.integracoreConfigService.get(
      AI_MODELS_DEFAULT_CONFIG_KEY_BY_TIER[tier],
    );
  }

  async setModelAdminEnabled(modelId: string, enabled: boolean): Promise<void> {
    await this.setModelsAdminEnabled([modelId], enabled);
  }

  async setModelsAdminEnabled(
    modelIds: string[],
    enabled: boolean,
  ): Promise<void> {
    const current = this.getDisabledModelIds();
    const idSet = new Set(modelIds);

    const disabledModels = enabled
      ? current.filter((id) => !idSet.has(id))
      : [...current, ...modelIds.filter((id) => !current.includes(id))];

    await this.integracoreConfigService.set(
      'AI_MODELS_DEFAULT_DISABLED',
      disabledModels,
    );
  }

  // the chosen model moves to the front; the rest of the chain stays so losing that provider's key still resolves the tier
  async setDefaultModel(tier: AiModelTier, modelId: string): Promise<void> {
    const current = this.getDefaultModelIdsForTier(tier);

    await this.integracoreConfigService.set(
      AI_MODELS_DEFAULT_CONFIG_KEY_BY_TIER[tier],
      [modelId, ...current.filter((id) => id !== modelId)],
    );
  }
}
