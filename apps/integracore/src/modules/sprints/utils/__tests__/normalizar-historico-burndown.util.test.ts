import { describe, expect, it } from 'vitest';

import { normalizarHistoricoBurndown } from 'src/modules/sprints/utils/normalizar-historico-burndown.util';

describe('normalizarHistoricoBurndown', () => {
  it('ordena, deduplica por dia e completa pontosTotais', () => {
    expect(
      normalizarHistoricoBurndown([
        { data: '2026-11-12', pontosRestantes: 20, pontosTotais: 30 },
        { data: '2026-11-10', pontosRestantes: 30 },
        { data: '2026-11-12', pontosRestantes: 18, pontosTotais: 30 },
      ]),
    ).toEqual([
      { data: '2026-11-10', pontosRestantes: 30, pontosTotais: 30 },
      { data: '2026-11-12', pontosRestantes: 18, pontosTotais: 30 },
    ]);
  });

  it('aceita JSON em texto', () => {
    expect(
      normalizarHistoricoBurndown('[{"data":"2026-11-10","pontosRestantes":5,"pontosTotais":5}]'),
    ).toHaveLength(1);
  });

  it('descarta entradas inválidas', () => {
    expect(normalizarHistoricoBurndown(null)).toEqual([]);
    expect(normalizarHistoricoBurndown('não é json')).toEqual([]);
    expect(normalizarHistoricoBurndown({ data: 'x' })).toEqual([]);
    expect(
      normalizarHistoricoBurndown([
        null,
        { data: '15/11/2026', pontosRestantes: 1 },
        { data: '2026-11-10', pontosRestantes: '3' },
      ]),
    ).toEqual([]);
  });
});
