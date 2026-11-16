import { type FieldMetadataType } from 'integracore-shared/types';

export type FormFieldCurrencyInputSettings = {
  type: FieldMetadataType.CURRENCY;
  amountUnit: 'micros' | 'units';
};
