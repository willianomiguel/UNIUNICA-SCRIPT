import { RATING_VALUES } from 'integracore-shared/constants';
import { type FieldRatingValue } from 'integracore-shared/types';

export const isFieldRatingValue = (
  fieldValue: unknown,
): fieldValue is FieldRatingValue =>
  RATING_VALUES.includes(fieldValue as NonNullable<FieldRatingValue>);
