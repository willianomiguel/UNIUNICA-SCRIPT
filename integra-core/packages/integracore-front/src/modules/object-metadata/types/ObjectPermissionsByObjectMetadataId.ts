import { type ObjectRecordsPermissions } from 'integracore-shared/types';

export type ObjectPermissionsByObjectMetadataId = Record<
  string,
  ObjectRecordsPermissions
>;
