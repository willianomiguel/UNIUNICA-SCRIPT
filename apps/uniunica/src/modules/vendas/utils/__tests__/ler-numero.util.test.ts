import { describe, expect, it } from 'vitest';

import { lerNumero } from 'src/modules/vendas/utils/ler-numero.util';

describe('lerNumero', () => {
  it('reads numbers and numeric strings in both decimal styles', () => {
    expect(lerNumero(10.5)).toBe(10.5);
    expect(lerNumero('197.5')).toBe(197.5);
    expect(lerNumero('1.234,56')).toBe(1234.56);
  });

  it('returns null for invalid values', () => {
    expect(lerNumero('')).toBeNull();
    expect(lerNumero('abc')).toBeNull();
    expect(lerNumero(null)).toBeNull();
    expect(lerNumero(Number.POSITIVE_INFINITY)).toBeNull();
  });
});
