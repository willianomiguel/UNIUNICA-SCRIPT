import { describe, expect, it } from 'vitest';

import { centavosParaReais } from 'src/modules/vendas/utils/centavos-para-reais.util';

describe('centavosParaReais', () => {
  it('converts cents to reais', () => {
    expect(centavosParaReais(19750)).toBe(197.5);
    expect(centavosParaReais('100')).toBe(1);
  });

  it('returns null for missing or invalid values', () => {
    expect(centavosParaReais(null)).toBeNull();
    expect(centavosParaReais(undefined)).toBeNull();
    expect(centavosParaReais('x')).toBeNull();
  });
});
