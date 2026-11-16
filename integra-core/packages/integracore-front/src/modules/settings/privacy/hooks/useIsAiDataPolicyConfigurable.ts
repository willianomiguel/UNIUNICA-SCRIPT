import { isNonEmptyArray } from 'integracore-shared/utils';

import { useAvailableAiDataPolicyOptions } from '@/settings/privacy/hooks/useAvailableAiDataPolicyOptions';

export const useIsAiDataPolicyConfigurable = () => {
  const { dataResidencyRegions, isZeroDataRetentionAvailable } =
    useAvailableAiDataPolicyOptions();

  return isNonEmptyArray(dataResidencyRegions) || isZeroDataRetentionAvailable;
};
