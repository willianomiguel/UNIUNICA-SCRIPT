import { describe, expect, it } from 'vitest';

import { registrarPontoBurndown } from 'src/modules/sprints/utils/registrar-ponto-burndown.util';

describe('registrarPontoBurndown', () => {
  it('adiciona a foto do dia em ordem', () => {
    expect(
      registrarPontoBurndown(
        [{ data: '2026-11-12', pontosRestantes: 10, pontosTotais: 20 }],
        { data: '2026-11-11', pontosRestantes: 15, pontosTotais: 20 },
      ).map((p) => p.data),
    ).toEqual(['2026-11-11', '2026-11-12']);
  });

  it('substitui foto do mesmo dia (idempotente)', () => {
    const ponto = { data: '2026-11-12', pontosRestantes: 8, pontosTotais: 20 };
    const uma = registrarPontoBurndown(
      [{ data: '2026-11-12', pontosRestantes: 10, pontosTotais: 20 }],
      ponto,
    );

    expect(uma).toEqual([ponto]);
    expect(registrarPontoBurndown(uma, ponto)).toEqual([ponto]);
  });

  it('funciona com histórico vazio', () => {
    expect(
      registrarPontoBurndown(null, { data: '2026-11-10', pontosRestantes: 1, pontosTotais: 1 }),
    ).toHaveLength(1);
  });
});
