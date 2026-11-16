import { objectPermissionsByObjectMetadataIdSelector } from '@/object-metadata/states/objectPermissionsByObjectMetadataIdSelector';
import { getObjectPermissionsForObject } from '@/object-metadata/utils/getObjectPermissionsForObject';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import { type ObjectRecordsPermissions } from 'integracore-shared/types';

export const useObjectPermissionsForObject = (
  objectMetadataId: string,
): ObjectRecordsPermissions => {
  const objectPermissionsByObjectMetadataId = useAtomStateValue(
    objectPermissionsByObjectMetadataIdSelector,
  );

  return useMemo(
    () =>
      getObjectPermissionsForObject(
        objectPermissionsByObjectMetadataId,
        objectMetadataId,
      ),
    [objectPermissionsByObjectMetadataId, objectMetadataId],
  );
};
