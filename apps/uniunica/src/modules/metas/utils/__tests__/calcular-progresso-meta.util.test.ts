import { describe, expect, it } from 'vitest';

import { calcularProgressoMeta } from 'src/modules/metas/utils/calcular-progresso-meta.util';

describe('calcularProgressoMeta', () => {
  it('calcula o avanço do inicial até o alvo', () => {
    expect(calcularProgressoMeta(0, 200, 50)).toBe(25);
    expect(calcularProgressoMeta(100, 200, 150)).toBe(50);
    expect(calcularProgressoMeta(0, 3, 1)).toBe(33.3);
  });

  it('funciona para metas de redução', () => {
    // chargeback de 3% para 1%: hoje em 2% → metade do caminho.
    expect(calcularProgressoMeta(3, 1, 2)).toBe(50);
    expect(calcularProgressoMeta(3, 1, 4)).toBe(0);
  });

  it('limita entre 0 e 100', () => {
    expect(calcularProgressoMeta(0, 100, 250)).toBe(100);
    expect(calcularProgressoMeta(0, 100, -5)).toBe(0);
  });

  it('trata alvo igual ao inicial e valores ausentes', () => {
    expect(calcularProgressoMeta(10, 10, 10)).toBe(100);
    expect(calcularProgressoMeta(10, 10, 5)).toBe(0);
    expect(calcularProgressoMeta(null, 100, 50)).toBe(50);
    expect(calcularProgressoMeta(0, null, 50)).toBe(0);
    expect(calcularProgressoMeta(0, 100, null)).toBe(0);
  });
});
