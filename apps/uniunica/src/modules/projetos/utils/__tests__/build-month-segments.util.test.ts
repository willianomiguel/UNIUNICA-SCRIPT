import { describe, expect, it } from 'vitest';

import { buildMonthSegments } from 'src/modules/projetos/utils/build-month-segments.util';

describe('buildMonthSegments', () => {
  const segments = buildMonthSegments({ startMs: Date.UTC(2026, 9, 1), endMs: Date.UTC(2027, 3, 1) });

  it('gera um segmento por mês, rotulando o primeiro e janeiro com o ano', () => {
    expect(segments.map((segment) => segment.label)).toEqual([
      'out 2026',
      'nov',
      'dez',
      'jan 2027',
      'fev',
      'mar',
    ]);
  });

  it('os segmentos cobrem 100% sem buracos', () => {
    const total = segments.reduce((sum, segment) => sum + segment.widthPercent, 0);

    expect(total).toBeCloseTo(100, 5);
    expect(segments[0].leftPercent).toBe(0);
    expect(segments[1].leftPercent).toBeCloseTo(segments[0].widthPercent, 5);
  });

  it('intervalo vazio não gera segmentos', () => {
    expect(buildMonthSegments({ startMs: 5, endMs: 5 })).toEqual([]);
  });
});
