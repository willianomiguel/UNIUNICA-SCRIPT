import { INTEGRA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/integracore-standard-application/constants/integracore-standard-applications';
import { type UniversalSyncableFlatEntity } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-entity-from.type';

export const belongsToIntegraCoreStandardApp = <
  T extends UniversalSyncableFlatEntity,
>({
  applicationUniversalIdentifier,
}: T) =>
  applicationUniversalIdentifier ===
  INTEGRA_STANDARD_APPLICATION.universalIdentifier;
