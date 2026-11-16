import { type InputSchemaPropertyType } from 'integracore-shared/workflow';
import { FieldMetadataType } from '~/generated-metadata/graphql';

export const isFieldTypeCompatibleWithRecordId = (
  type?: InputSchemaPropertyType,
): boolean => {
  return (
    !type ||
    type === 'string' ||
    type === 'unknown' ||
    type === FieldMetadataType.UUID
  );
};
