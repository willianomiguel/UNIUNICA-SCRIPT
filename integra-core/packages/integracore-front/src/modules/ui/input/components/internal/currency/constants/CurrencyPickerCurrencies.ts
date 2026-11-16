import { type CurrencyPickerOption } from 'integracore-ui/components/input';
import { CURRENCY_CODE_LABELS } from 'integracore-shared/constants';

export const CURRENCY_PICKER_CURRENCIES: readonly CurrencyPickerOption[] =
  Object.entries(CURRENCY_CODE_LABELS).map(([code, { label }]) => ({
    code,
    name: label,
  }));
