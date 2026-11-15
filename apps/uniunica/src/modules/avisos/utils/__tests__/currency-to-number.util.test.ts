import { describe, expect, it } from 'vitest';

import { currencyToNumber } from 'src/modules/avisos/utils/currency-to-number.util';

describe('currencyToNumber', () => {
  it('converte amountMicros (número ou string) em reais', () => {
    expect(currencyToNumber({ amountMicros: 1_500_000, currencyCode: 'BRL' })).toBe(1.5);
    expect(currencyToNumber({ amountMicros: '250000000' })).toBe(250);
  });

  it('retorna 0 para valores vazios ou inválidos', () => {
    expect(currencyToNumber(null)).toBe(0);
    expect(currencyToNumber({ amountMicros: null })).toBe(0);
    expect(currencyToNumber({ amountMicros: 'abc' })).toBe(0);
    expect(currencyToNumber(10)).toBe(0);
  });
});
