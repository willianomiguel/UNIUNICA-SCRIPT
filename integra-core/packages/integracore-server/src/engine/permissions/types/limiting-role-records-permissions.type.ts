import { type ObjectRecordsPermissions } from 'integracore-shared/types';

import { type RoleRecordsPermissions } from 'src/engine/permissions/types/role-records-permissions.type';

export type LimitingObjectRecordsPermissions = Omit<
  ObjectRecordsPermissions,
  'rowLevelRecordsPermissions'
>;

export type LimitingRoleRecordsPermissions = Omit<
  RoleRecordsPermissions,
  'objects'
> & {
  objects: Partial<Record<string, LimitingObjectRecordsPermissions>>;
};
