import { type ObjectRecordsPermissions } from 'integracore-shared/types';

type GetFieldPermissionsArgs = {
  objectPermissions: Pick<
    ObjectRecordsPermissions,
    'unreadableFields' | 'uneditableFields'
  >;
  fieldMetadataId: string;
};

export const getFieldPermissions = ({
  objectPermissions,
  fieldMetadataId,
}: GetFieldPermissionsArgs) => ({
  canReadField: !objectPermissions.unreadableFields.includes(fieldMetadataId),
  canUpdateField: !objectPermissions.uneditableFields.includes(fieldMetadataId),
});
