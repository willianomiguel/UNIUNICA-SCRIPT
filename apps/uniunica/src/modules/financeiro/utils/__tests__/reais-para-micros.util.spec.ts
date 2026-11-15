import { describe, expect, it } from 'vitest';

import { reaisParaMicros } from 'src/modules/financeiro/utils/reais-para-micros.util';

describe('reaisParaMicros', () => {
  it('converte reais em micros arredondando centavos', () => {
    expect(reaisParaMicros(10)).toBe(10_000_000);
    expect(reaisParaMicros(0.1 + 0.2)).toBe(300_000);
    expect(reaisParaMicros(1234.567)).toBe(1_234_570_000);
  });
});
