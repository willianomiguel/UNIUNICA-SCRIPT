import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { IndexType } from 'integracore-shared/types';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/integracore-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildTaskStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  integracoreStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'task'>, 'context'>): Record<
  AllStandardObjectIndexName<'task'>,
  FlatIndexMetadata
> => ({
  assigneeIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'assigneeIdIndex',
      relatedFieldNames: ['assignee'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  searchVectorGinIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'searchVectorGinIndex',
      relatedFieldNames: ['searchVector'],
      indexType: IndexType.GIN,
      hasDeterministicUniversalIdentifier: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
});
