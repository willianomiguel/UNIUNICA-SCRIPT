import { describe, expect, it } from 'vitest';

import { calcularTempoDecorrido } from 'src/modules/metas/utils/calcular-tempo-decorrido.util';

describe('calcularTempoDecorrido', () => {
  it('conta dias inteiros incluindo hoje e o último dia', () => {
    // período de 10 dias; no 5º dia, 50% decorrido.
    expect(calcularTempoDecorrido('2026-11-01', '2026-11-10', '2026-11-05')).toBe(50);
    expect(calcularTempoDecorrido('2026-11-01', '2026-11-10', '2026-11-10')).toBe(100);
  });

  it('limita antes do início e depois do fim', () => {
    expect(calcularTempoDecorrido('2026-11-01', '2026-11-10', '2026-10-01')).toBe(0);
    expect(calcularTempoDecorrido('2026-11-01', '2026-11-10', '2026-12-01')).toBe(100);
  });

  it('retorna null sem datas válidas', () => {
    expect(calcularTempoDecorrido(null, '2026-11-10', '2026-11-05')).toBeNull();
    expect(calcularTempoDecorrido('2026-11-10', '2026-11-01', '2026-11-05')).toBeNull();
    expect(calcularTempoDecorrido('x', '2026-11-01', '2026-11-05')).toBeNull();
  });
});
