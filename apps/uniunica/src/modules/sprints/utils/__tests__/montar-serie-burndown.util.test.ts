import { describe, expect, it } from 'vitest';

import { montarSerieBurndown } from 'src/modules/sprints/utils/montar-serie-burndown.util';

describe('montarSerieBurndown', () => {
  it('linha ideal vai do total até zero', () => {
    const serie = montarSerieBurndown({
      dataInicio: '2026-11-10',
      dataFim: '2026-11-14',
      pontosTotais: 20,
      historico: [],
      hoje: '2026-11-09',
    });

    expect(serie.map((p) => p.ideal)).toEqual([20, 15, 10, 5, 0]);
    expect(serie.every((p) => p.real === null)).toBe(true);
  });

  it('linha real usa fotos e repete a última até hoje', () => {
    const serie = montarSerieBurndown({
      dataInicio: '2026-11-10',
      dataFim: '2026-11-14',
      pontosTotais: 20,
      historico: [
        { data: '2026-11-10', pontosRestantes: 20, pontosTotais: 20 },
        { data: '2026-11-11', pontosRestantes: 17, pontosTotais: 20 },
      ],
      hoje: '2026-11-12',
    });

    expect(serie.map((p) => p.real)).toEqual([20, 17, 17, null, null]);
  });

  it('arredonda a linha ideal', () => {
    const serie = montarSerieBurndown({
      dataInicio: '2026-11-10',
      dataFim: '2026-11-13',
      pontosTotais: 10,
      historico: null,
      hoje: '2026-11-10',
    });

    expect(serie.map((p) => p.ideal)).toEqual([10, 6.67, 3.33, 0]);
  });

  it('sprint de um dia ou sem datas', () => {
    expect(
      montarSerieBurndown({ dataInicio: '2026-11-10', dataFim: '2026-11-10', pontosTotais: 5, historico: [], hoje: '2026-11-10' }),
    ).toEqual([{ data: '2026-11-10', ideal: 0, real: null }]);
    expect(
      montarSerieBurndown({ dataInicio: null, dataFim: null, pontosTotais: 5, historico: [], hoje: '2026-11-10' }),
    ).toEqual([]);
  });
});
