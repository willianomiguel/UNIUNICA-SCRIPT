import { describe, expect, it } from 'vitest';

import { computeRoadmapRange } from 'src/modules/projetos/utils/compute-roadmap-range.util';

const today = Date.UTC(2026, 10, 15);

describe('computeRoadmapRange', () => {
  it('sem projetos mostra o trimestre atual e o próximo', () => {
    expect(computeRoadmapRange([], today)).toEqual({
      startMs: Date.UTC(2026, 9, 1),
      endMs: Date.UTC(2027, 3, 1),
    });
  });

  it('amplia para cobrir projetos antes e depois, em trimestres inteiros', () => {
    const range = computeRoadmapRange(
      [
        { id: '1', dataInicio: '2026-08-10', dataFim: '2026-12-01' },
        { id: '2', dataInicio: '2027-02-01', dataFim: '2027-05-20' },
      ],
      today,
    );

    expect(range).toEqual({ startMs: Date.UTC(2026, 6, 1), endMs: Date.UTC(2027, 6, 1) });
  });

  it('ignora datas inválidas', () => {
    expect(computeRoadmapRange([{ id: '1', dataInicio: 'x', dataFim: null }], today)).toEqual({
      startMs: Date.UTC(2026, 9, 1),
      endMs: Date.UTC(2027, 3, 1),
    });
  });

  it('limita a 8 trimestres a partir do início', () => {
    const range = computeRoadmapRange([{ id: '1', dataInicio: '2026-10-01', dataFim: '2035-01-01' }], today);

    expect(range.endMs).toBe(Date.UTC(2028, 9, 1));
  });
});
