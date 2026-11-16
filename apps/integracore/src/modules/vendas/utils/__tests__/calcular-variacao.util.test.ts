import { describe, expect, it } from 'vitest';

import { calcularVariacao } from 'src/modules/vendas/utils/calcular-variacao.util';

describe('calcularVariacao', () => {
  it('returns the relative change', () => {
    expect(calcularVariacao(150, 100)).toBe(0.5);
    expect(calcularVariacao(50, 100)).toBe(-0.5);
  });

  it('returns null without a previous value', () => {
    expect(calcularVariacao(10, 0)).toBeNull();
  });
});
