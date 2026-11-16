import { type PermissionFlagType } from 'integracore-shared/constants';

import { type RoleRecordsPermissions } from 'src/engine/permissions/types/role-records-permissions.type';

export type UserWorkspacePermissions = {
  permissionFlags: Record<PermissionFlagType, boolean>;
  recordsPermissions: RoleRecordsPermissions;
};
