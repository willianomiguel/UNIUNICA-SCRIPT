import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/integracore-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildAccessGroupStandardFlatIndexMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  integracoreStandardApplicationId,
}: Omit<CreateStandardIndexArgs<'accessGroup'>, 'context'>): Record<
  AllStandardObjectIndexName<'accessGroup'>,
  FlatIndexMetadata
> => ({
  roleIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'roleIdIndex',
      relatedFieldNames: ['roleId'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  objectMetadataIdIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'objectMetadataIdIndex',
      relatedFieldNames: ['objectMetadataId'],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
  groupHashUniqueIndex: createStandardIndexFlatMetadata({
    objectName,
    workspaceId,
    context: {
      indexName: 'groupHashUniqueIndex',
      relatedFieldNames: ['groupHash'],
      isUnique: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    integracoreStandardApplicationId,
    now,
  }),
});
