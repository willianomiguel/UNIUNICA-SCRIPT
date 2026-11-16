import { describe, expect, it } from 'vitest';

import { calcularEscalaLinear } from 'src/modules/sprints/utils/calcular-escala-linear.util';

describe('calcularEscalaLinear', () => {
  it('mapeia o domínio na faixa', () => {
    const escala = calcularEscalaLinear([0, 20], [200, 0]);

    expect(escala(0)).toBe(200);
    expect(escala(20)).toBe(0);
    expect(escala(5)).toBe(150);
  });

  it('domínio degenerado vai para o meio da faixa', () => {
    expect(calcularEscalaLinear([3, 3], [0, 100])(3)).toBe(50);
  });
});
