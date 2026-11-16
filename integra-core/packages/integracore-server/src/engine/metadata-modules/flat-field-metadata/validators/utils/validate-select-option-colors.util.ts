import { type EnumFieldMetadataType } from 'integracore-shared/types';
import { isFieldMetadataSelectKind } from 'integracore-shared/utils';

import { type FlatFieldMetadataValidationError } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata-validation-error.type';
import { validateMetadataOptionColor } from 'src/engine/metadata-modules/flat-field-metadata/validators/utils/validate-metadata-option-color.util';
import { type UniversalFlatFieldMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-field-metadata.type';

export const validateSelectOptionColors = (
  universalFlatFieldMetadata: UniversalFlatFieldMetadata<EnumFieldMetadataType>,
): FlatFieldMetadataValidationError[] => {
  if (!isFieldMetadataSelectKind(universalFlatFieldMetadata.type)) {
    return [];
  }

  return (universalFlatFieldMetadata.options ?? []).flatMap((option) =>
    validateMetadataOptionColor(option),
  );
};
