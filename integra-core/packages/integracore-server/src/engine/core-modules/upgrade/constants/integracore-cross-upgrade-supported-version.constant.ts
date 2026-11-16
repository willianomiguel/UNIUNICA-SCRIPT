import { INTEGRA_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/integracore-current-version.constant';
import { INTEGRA_PREVIOUS_VERSIONS } from 'src/engine/core-modules/upgrade/constants/integracore-previous-versions.constant';

export const INTEGRA_CROSS_UPGRADE_SUPPORTED_VERSIONS = [
  ...INTEGRA_PREVIOUS_VERSIONS,
  INTEGRA_CURRENT_VERSION,
] as const;

export type IntegraCoreCrossUpgradeSupportedVersion =
  (typeof INTEGRA_CROSS_UPGRADE_SUPPORTED_VERSIONS)[number];
