/* @license Enterprise */

import { type RowLevelPermissionPredicate } from 'integracore-shared/types';

export const buildMemberFieldKey = ({
  workspaceMemberFieldMetadataId,
  workspaceMemberSubFieldName,
}: Pick<
  RowLevelPermissionPredicate,
  'workspaceMemberFieldMetadataId' | 'workspaceMemberSubFieldName'
>): string =>
  `${workspaceMemberFieldMetadataId}:${workspaceMemberSubFieldName ?? ''}`;
