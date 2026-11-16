import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { isObjectMetadataReadOnly } from '@/object-record/read-only/utils/isObjectMetadataReadOnly';
import { type ObjectRecordsPermissions } from 'integracore-shared/types';
import { canReachSomeRecords, isDefined } from 'integracore-shared/utils';

type CanCreateRecordsForObjectMetadataItemParams = {
  objectPermissions?: ObjectRecordsPermissions;
  objectMetadataItem: Pick<
    EnrichedObjectMetadataItem,
    'isUICreatable' | 'isUIEditable' | 'isRemote'
  >;
};

export const canCreateRecordsForObjectMetadataItem = ({
  objectPermissions,
  objectMetadataItem,
}: CanCreateRecordsForObjectMetadataItemParams): boolean => {
  return (
    objectMetadataItem.isUICreatable &&
    !isObjectMetadataReadOnly({ objectMetadataItem }) &&
    (!isDefined(objectPermissions) ||
      canReachSomeRecords({
        objectRecordsPermissions: objectPermissions,
        operationType: 'create',
      }))
  );
};
