import { type AllowedAddressSubField } from 'integracore-shared/types';

export const ADDRESS_DETAIL_SUB_FIELDS = [
  'addressStreet2',
  'addressCity',
  'addressState',
  'addressPostcode',
  'addressCountry',
] as const satisfies readonly AllowedAddressSubField[];
