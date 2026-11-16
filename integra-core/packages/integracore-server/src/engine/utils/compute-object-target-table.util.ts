import { INTEGRA_STANDARD_APPLICATION } from 'src/engine/workspace-manager/integracore-standard-application/constants/integracore-standard-applications';
import { type UniversalFlatObjectMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-object-metadata.type';

import { computeTableName } from './compute-table-name.util';

export const computeObjectTargetTable = (
  objectMetadata: Pick<
    UniversalFlatObjectMetadata,
    'nameSingular' | 'applicationUniversalIdentifier'
  >,
) => {
  return computeTableName(
    objectMetadata.nameSingular,
    objectMetadata.applicationUniversalIdentifier !==
      INTEGRA_STANDARD_APPLICATION.universalIdentifier,
  );
};
