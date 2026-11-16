import { StandardObjectNameSingular } from 'integracore-shared/types';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

export const isObjectMetadataAvailableForRelation = (
  objectMetadataItem: Pick<
    EnrichedObjectMetadataItem,
    'isSystem' | 'nameSingular' | 'isRemote'
  >,
) => {
  return (
    (!objectMetadataItem.isSystem ||
      objectMetadataItem.nameSingular ===
        StandardObjectNameSingular.WorkspaceMember) &&
    !objectMetadataItem.isRemote
  );
};
