import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/integracore-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildRecordShareStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  integracoreStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'recordShare'>, 'context'>): Record<
  AllStandardObjectIndexName<'recordShare'>,
  FlatIndexMetadata
> => ({
  recordPrincipalCauseSourceUniqueIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'recordPrincipalCauseSourceUniqueIndex',
      relatedFieldNames: [
        'objectMetadataId',
        'recordId',
        'principalId',
        'rowCause',
        'sourceId',
      ],
      isUnique: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  principalIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'principalIdIndex',
      relatedFieldNames: ['principalId'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  sourceIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'sourceIdIndex',
      relatedFieldNames: ['sourceId'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
});
