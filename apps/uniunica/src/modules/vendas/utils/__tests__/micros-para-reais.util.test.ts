import { describe, expect, it } from 'vitest';

import { microsParaReais } from 'src/modules/vendas/utils/micros-para-reais.util';

describe('microsParaReais', () => {
  it('converts numbers and numeric strings', () => {
    expect(microsParaReais(197_500_000)).toBe(197.5);
    expect(microsParaReais('1990000')).toBe(1.99);
  });

  it('returns null for empty or invalid values', () => {
    expect(microsParaReais(null)).toBeNull();
    expect(microsParaReais(undefined)).toBeNull();
    expect(microsParaReais('')).toBeNull();
    expect(microsParaReais('abc')).toBeNull();
  });
});
