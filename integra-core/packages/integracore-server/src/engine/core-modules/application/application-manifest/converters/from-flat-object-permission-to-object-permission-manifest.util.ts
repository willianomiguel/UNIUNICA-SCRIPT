import { type ObjectPermissionManifest } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

import { type UniversalFlatObjectPermission } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-object-permission.type';

export const fromFlatObjectPermissionToObjectPermissionManifest = ({
  flatObjectPermission,
}: {
  flatObjectPermission: UniversalFlatObjectPermission;
}): ObjectPermissionManifest => ({
  universalIdentifier: flatObjectPermission.universalIdentifier,
  objectUniversalIdentifier:
    flatObjectPermission.objectMetadataUniversalIdentifier,
  ...(isDefined(flatObjectPermission.canReadObjectRecords)
    ? { canReadObjectRecords: flatObjectPermission.canReadObjectRecords }
    : {}),
  ...(isDefined(flatObjectPermission.canUpdateObjectRecords)
    ? { canUpdateObjectRecords: flatObjectPermission.canUpdateObjectRecords }
    : {}),
  ...(isDefined(flatObjectPermission.canSoftDeleteObjectRecords)
    ? {
        canSoftDeleteObjectRecords:
          flatObjectPermission.canSoftDeleteObjectRecords,
      }
    : {}),
  ...(isDefined(flatObjectPermission.canDestroyObjectRecords)
    ? { canDestroyObjectRecords: flatObjectPermission.canDestroyObjectRecords }
    : {}),
});
