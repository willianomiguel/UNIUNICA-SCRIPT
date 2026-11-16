import { type RelativeDateFilterUnit } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';

export const RELATIVE_DATE_UNITS: RelativeDateFilterUnit[] = [
  doNotTranslate('DAY'),
  'WEEK',
  'MONTH',
  'QUARTER',
  'YEAR',
];
