import { FieldMetadataType, type CompositeProperty } from 'integracore-shared/types';

export function computeCompositeFieldTypeOptions(
  property: CompositeProperty<FieldMetadataType>,
) {
  return {
    nullable: !property.isRequired,
    isArray:
      property.type === FieldMetadataType.MULTI_SELECT || property.isArray,
  };
}
