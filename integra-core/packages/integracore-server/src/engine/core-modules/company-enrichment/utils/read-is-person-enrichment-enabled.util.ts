import { isNonEmptyString } from '@sniptt/guards';

import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

export const readIsPersonEnrichmentEnabled = (
  integracoreConfigService: IntegraCoreConfigService,
): boolean =>
  integracoreConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED') &&
  isNonEmptyString(integracoreConfigService.get('PEOPLE_DATA_LABS_API_KEY'));
