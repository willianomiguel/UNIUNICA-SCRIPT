import { isNonEmptyArray } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';
import { type InputSchemaProperty } from 'integracore-shared/workflow';
import { type SelectOption } from 'integracore-ui/primitives/input';

export const getWorkflowCodeFieldsEnumSelectOptions = (
  property: InputSchemaProperty | undefined,
): SelectOption[] => {
  if (!isDefined(property) || !isNonEmptyArray(property.enum)) {
    return [];
  }

  return property.enum.map((value) => ({
    value,
    label: value,
  }));
};
