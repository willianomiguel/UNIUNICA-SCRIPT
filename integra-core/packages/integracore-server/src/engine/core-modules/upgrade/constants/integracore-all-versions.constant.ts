import { INTEGRA_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/integracore-current-version.constant';
import { INTEGRA_NEXT_VERSIONS } from 'src/engine/core-modules/upgrade/constants/integracore-next-versions.constant';
import { INTEGRA_PREVIOUS_VERSIONS } from 'src/engine/core-modules/upgrade/constants/integracore-previous-versions.constant';

export const INTEGRA_ALL_VERSIONS = [
  ...INTEGRA_PREVIOUS_VERSIONS,
  INTEGRA_CURRENT_VERSION,
  ...INTEGRA_NEXT_VERSIONS,
] as const;

export type IntegraCoreAllVersion = (typeof INTEGRA_ALL_VERSIONS)[number];
