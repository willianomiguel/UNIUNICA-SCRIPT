import { isNonEmptyArray } from '@sniptt/guards';
import {
  isRecordArraySchema,
  isRecordObjectSchema,
} from 'integracore-shared/logic-function';
import { FieldMetadataType } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';
import { type InputSchemaProperty } from 'integracore-shared/workflow';

type WorkflowCodeFieldsLeafKind =
  | 'array'
  | 'boolean'
  | 'enum'
  | 'enum-array'
  | 'number'
  | 'record'
  | 'record-array'
  | 'text';

export const getWorkflowCodeFieldsLeafKind = (
  property: InputSchemaProperty | undefined,
): WorkflowCodeFieldsLeafKind => {
  if (!isDefined(property)) {
    return 'text';
  }

  if (isRecordObjectSchema(property)) {
    return 'record';
  }

  if (isRecordArraySchema(property)) {
    return 'record-array';
  }

  if (
    (property.type === 'string' || property.type === FieldMetadataType.TEXT) &&
    isNonEmptyArray(property.enum)
  ) {
    return 'enum';
  }

  if (property.type === 'array' || property.type === FieldMetadataType.ARRAY) {
    const itemKind = getWorkflowCodeFieldsLeafKind(property.items);

    if (itemKind === 'enum') {
      return 'enum-array';
    }

    return 'array';
  }

  switch (property.type) {
    case 'boolean':
    case FieldMetadataType.BOOLEAN:
      return 'boolean';
    case 'number':
    case FieldMetadataType.NUMBER:
    case FieldMetadataType.NUMERIC:
      return 'number';
    default:
      return 'text';
  }
};
