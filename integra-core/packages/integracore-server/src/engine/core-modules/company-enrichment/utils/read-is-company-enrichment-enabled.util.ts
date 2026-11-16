import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';

import { readBookCallStepMinEmployeeCount } from 'src/engine/core-modules/onboarding/utils/read-book-call-step-min-employee-count.util';
import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';

// Enrichment is only worth running when something consumes it and the provider
// can actually answer, so callers can skip the round-trip entirely.
export const readIsCompanyEnrichmentEnabled = (
  integracoreConfigService: IntegraCoreConfigService,
): boolean => {
  const hasConsumer =
    integracoreConfigService.get('IS_ONBOARDING_AI_CHAT_ENABLED') ||
    isDefined(readBookCallStepMinEmployeeCount(integracoreConfigService));

  return (
    hasConsumer &&
    isNonEmptyString(integracoreConfigService.get('PEOPLE_DATA_LABS_API_KEY'))
  );
};
