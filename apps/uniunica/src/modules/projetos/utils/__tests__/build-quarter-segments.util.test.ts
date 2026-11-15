import { describe, expect, it } from 'vitest';

import { buildQuarterSegments } from 'src/modules/projetos/utils/build-quarter-segments.util';

describe('buildQuarterSegments', () => {
  it('gera os trimestres do intervalo', () => {
    const segments = buildQuarterSegments({ startMs: Date.UTC(2026, 9, 1), endMs: Date.UTC(2027, 3, 1) });

    expect(segments.map((segment) => segment.label)).toEqual(['2026-T4', '2027-T1']);
    expect(segments[0].leftPercent).toBe(0);
    expect(segments[0].widthPercent + segments[1].widthPercent).toBeCloseTo(100, 5);
    // T4 tem 92 dias e T1/2027 tem 90.
    expect(segments[0].widthPercent).toBeCloseTo((92 / 182) * 100, 5);
  });
});
