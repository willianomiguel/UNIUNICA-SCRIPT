import {
  type FeatureFlagKey,
  type ObjectRecordsPermissions,
} from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

import { getEnforcedOperationType } from 'src/engine/permissions/internal/role/utils/get-enforced-operation-type.util';
import { type RoleRecordsPermissions } from 'src/engine/permissions/types/role-records-permissions.type';

const followUpdateForCreate = (
  objectRecordsPermissions: ObjectRecordsPermissions,
): ObjectRecordsPermissions => {
  const { rowLevelRecordsPermissions } = objectRecordsPermissions;

  return {
    ...objectRecordsPermissions,
    canCreateAllRecords: objectRecordsPermissions.canUpdateAllRecords,
    ...(isDefined(rowLevelRecordsPermissions) && {
      rowLevelRecordsPermissions: rowLevelRecordsPermissions.map((rule) => ({
        ...rule,
        canCreateRecords: rule.canUpdateRecords,
      })),
    }),
  };
};

export const followUpdateWhenCreatePermissionIsDisabled = ({
  recordsPermissions,
  featureFlagsMap,
}: {
  recordsPermissions: RoleRecordsPermissions;
  featureFlagsMap: Partial<Record<FeatureFlagKey, boolean>>;
}): RoleRecordsPermissions => {
  if (
    getEnforcedOperationType({ operationType: 'create', featureFlagsMap }) ===
    'create'
  ) {
    return recordsPermissions;
  }

  const objects: RoleRecordsPermissions['objects'] = {};

  for (const [objectMetadataId, objectRecordsPermissions] of Object.entries(
    recordsPermissions.objects,
  )) {
    objects[objectMetadataId] = isDefined(objectRecordsPermissions)
      ? followUpdateForCreate(objectRecordsPermissions)
      : objectRecordsPermissions;
  }

  return { ...recordsPermissions, objects };
};
