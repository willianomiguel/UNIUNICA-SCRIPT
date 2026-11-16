import { type FieldMetadataType } from 'integracore-shared/types';
import { pascalCase } from 'integracore-shared/utils';

import { type GqlInputTypeDefinitionKind } from 'src/engine/api/graphql/workspace-schema-builder/enums/gql-input-type-definition-kind.enum';

export const computeCompositeFieldInputTypeKey = (
  fieldType: FieldMetadataType,
  kind: GqlInputTypeDefinitionKind,
): string => {
  const name = pascalCase(fieldType.toString().toLowerCase());

  return `${pascalCase(name)}${kind.toString()}Input`;
};
