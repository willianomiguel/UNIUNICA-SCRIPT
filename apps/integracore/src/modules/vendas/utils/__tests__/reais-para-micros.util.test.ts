import { describe, expect, it } from 'vitest';

import { reaisParaMicros } from 'src/modules/vendas/utils/reais-para-micros.util';

describe('reaisParaMicros', () => {
  it('converts reais to micros rounding to cents', () => {
    expect(reaisParaMicros(197.5)).toBe(197_500_000);
    expect(reaisParaMicros(0.1 + 0.2)).toBe(300_000);
    expect(reaisParaMicros(19.999)).toBe(20_000_000);
  });
});
