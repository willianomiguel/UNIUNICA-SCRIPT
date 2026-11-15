import { describe, expect, it } from 'vitest';

import { calcularDiasRestantes } from 'src/modules/metas/utils/calcular-dias-restantes.util';

describe('calcularDiasRestantes', () => {
  it('conta dias até o fim, negativo após o prazo', () => {
    expect(calcularDiasRestantes('2026-12-31', '2026-11-15')).toBe(46);
    expect(calcularDiasRestantes('2026-11-15', '2026-11-15')).toBe(0);
    expect(calcularDiasRestantes('2026-11-10', '2026-11-15')).toBe(-5);
  });

  it('null sem data válida', () => {
    expect(calcularDiasRestantes(null, '2026-11-15')).toBeNull();
    expect(calcularDiasRestantes('x', '2026-11-15')).toBeNull();
  });
});
