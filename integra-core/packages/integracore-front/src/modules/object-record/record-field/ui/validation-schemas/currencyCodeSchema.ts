import { z } from 'zod';

import { CurrencyCode } from 'integracore-shared/constants';

export const currencyCodeSchema = z.enum(CurrencyCode);
