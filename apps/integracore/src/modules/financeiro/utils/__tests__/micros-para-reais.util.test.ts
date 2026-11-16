import { describe, expect, it } from 'vitest';

import { microsParaReais } from 'src/modules/financeiro/utils/micros-para-reais.util';

describe('microsParaReais', () => {
  it('converte número e string', () => {
    expect(microsParaReais(1_500_000)).toBe(1.5);
    expect(microsParaReais('250000000')).toBe(250);
  });

  it('trata vazio e inválido como zero', () => {
    expect(microsParaReais(null)).toBe(0);
    expect(microsParaReais(undefined)).toBe(0);
    expect(microsParaReais('')).toBe(0);
    expect(microsParaReais('abc')).toBe(0);
  });
});
