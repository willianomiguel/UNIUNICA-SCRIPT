import { describe, expect, it } from 'vitest';

import { reaisParaMicros } from 'src/modules/trafego/utils/reais-para-micros.util';

describe('reaisParaMicros', () => {
  it('converte reais em micros arredondando centavos', () => {
    expect(reaisParaMicros(12.34)).toBe(12_340_000);
    expect(reaisParaMicros(0.1 + 0.2)).toBe(300_000);
  });
  it('inválido vira 0', () => expect(reaisParaMicros(Number.NaN)).toBe(0));
});
