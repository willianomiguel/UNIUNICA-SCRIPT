/* @license Enterprise */

import { FeatureFlagKey } from 'integracore-shared/types';

export const areRecordAccessGroupsEnabled = ({
  featureFlagsMap,
}: {
  featureFlagsMap: Partial<Record<FeatureFlagKey, boolean>>;
}): boolean =>
  featureFlagsMap[FeatureFlagKey.IS_ACCESS_GROUPS_ENABLED] ?? false;
