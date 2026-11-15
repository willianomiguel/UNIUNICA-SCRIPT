import { describe, expect, it } from 'vitest';

import { calcularTrimestre } from 'src/modules/metas/utils/calcular-trimestre.util';

describe('calcularTrimestre', () => {
  it('calcula período, início e fim', () => {
    expect(calcularTrimestre('2026-11-15')).toEqual({
      periodo: '2026-T4',
      dataInicio: '2026-10-01',
      dataFim: '2026-12-31',
    });
    expect(calcularTrimestre('2026-01-01')).toEqual({
      periodo: '2026-T1',
      dataInicio: '2026-01-01',
      dataFim: '2026-03-31',
    });
    expect(calcularTrimestre('2026-06-30').dataFim).toBe('2026-06-30');
  });
});
