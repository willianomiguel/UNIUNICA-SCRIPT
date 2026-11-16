import { type FieldMetadataType } from 'integracore-shared/types';
import { pascalCase } from 'integracore-shared/utils';

import { ObjectTypeDefinitionKind } from 'src/engine/api/graphql/workspace-schema-builder/enums/object-type-definition-kind.enum';

export const computeCompositeFieldObjectTypeKey = (
  compositeFieldMetadataType: FieldMetadataType,
): string => {
  return `${pascalCase(compositeFieldMetadataType)}${ObjectTypeDefinitionKind.Plain.toString()}`;
};
