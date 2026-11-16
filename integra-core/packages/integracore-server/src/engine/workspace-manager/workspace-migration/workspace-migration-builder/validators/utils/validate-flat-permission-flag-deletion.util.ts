import { msg, t } from '@lingui/core/macro';
import { ALL_METADATA_NAME } from 'integracore-shared/metadata';
import { isDefined } from 'integracore-shared/utils';

import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { PermissionFlagExceptionCode } from 'src/engine/metadata-modules/permission-flag/permission-flag.exception';
import { belongsToIntegraCoreStandardApp } from 'src/engine/metadata-modules/utils/belongs-to-integracore-standard-app.util';
import { isCallerIntegraCoreStandardApp } from 'src/engine/metadata-modules/utils/is-caller-integracore-standard-app.util';
import { type FailedFlatEntityValidation } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';
import { getEmptyFlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/utils/get-flat-entity-validation-error.util';
import { type UniversalFlatEntityValidationArgs } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/universal-flat-entity-validation-args.type';

export const validateFlatPermissionFlagDeletion = ({
  flatEntityToValidate: { universalIdentifier },
  optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
    flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps,
  },
  buildOptions,
}: Pick<
  UniversalFlatEntityValidationArgs<typeof ALL_METADATA_NAME.permissionFlag>,
  | 'buildOptions'
  | 'flatEntityToValidate'
  | 'optimisticFlatEntityMapsAndRelatedFlatEntityMaps'
>): FailedFlatEntityValidation<'permissionFlag', 'delete'> => {
  const validationResult = getEmptyFlatEntityValidationError({
    flatEntityMinimalInformation: {
      universalIdentifier,
    },
    metadataName: 'permissionFlag',
    type: 'delete',
  });

  const existing = findFlatEntityByUniversalIdentifier({
    universalIdentifier,
    flatEntityMaps: optimisticFlatPermissionFlagMaps,
  });

  if (!isDefined(existing)) {
    validationResult.errors.push({
      code: PermissionFlagExceptionCode.PERMISSION_FLAG_NOT_FOUND,
      message: t`Permission flag definition to delete not found`,
      userFriendlyMessage: msg`Permission flag definition not found`,
    });

    return validationResult;
  }

  if (
    !isCallerIntegraCoreStandardApp(buildOptions) &&
    belongsToIntegraCoreStandardApp({
      universalIdentifier: existing.universalIdentifier,
      applicationUniversalIdentifier: existing.applicationUniversalIdentifier,
    })
  ) {
    validationResult.errors.push({
      code: PermissionFlagExceptionCode.PERMISSION_FLAG_IS_STANDARD,
      message: t`Cannot delete standard permission flag definition`,
      userFriendlyMessage: msg`Cannot delete standard permission flag definition`,
    });
  }

  return validationResult;
};
