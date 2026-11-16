/* @license Enterprise */

import { isNonEmptyArray } from 'integracore-shared/utils';

import { type PermissionsObjectAccessRequest } from 'src/engine/permissions/internal/combine/types/row-access-policy.type';
import { findRelatedRecordPathsGrantingOperation } from 'src/engine/permissions/internal/related-record-path/utils/find-related-record-paths-granting-operation.util';

export const canRelatedRecordPathGrantOperation = (
  request: Pick<
    PermissionsObjectAccessRequest,
    'metadataMaps' | 'flatObjectMetadata' | 'operationType'
  >,
): boolean => isNonEmptyArray(findRelatedRecordPathsGrantingOperation(request));
