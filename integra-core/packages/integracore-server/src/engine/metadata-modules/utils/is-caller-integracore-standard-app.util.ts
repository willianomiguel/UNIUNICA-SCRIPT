import { INTEGRA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/integracore-standard-application/constants/integracore-standard-applications';
import { type WorkspaceMigrationBuilderOptions } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration-builder-options.type';

export const isCallerIntegraCoreStandardApp = (
  buildOptions: WorkspaceMigrationBuilderOptions,
) =>
  buildOptions.applicationUniversalIdentifier ===
  INTEGRA_STANDARD_APPLICATION.universalIdentifier;
