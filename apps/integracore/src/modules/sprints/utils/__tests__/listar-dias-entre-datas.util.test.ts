import { describe, expect, it } from 'vitest';

import { listarDiasEntreDatas } from 'src/modules/sprints/utils/listar-dias-entre-datas.util';

describe('listarDiasEntreDatas', () => {
  it('lista dias inclusive, atravessando meses', () => {
    expect(listarDiasEntreDatas('2026-11-29', '2026-12-02')).toEqual([
      '2026-11-29',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
    ]);
  });

  it('aceita data com horário', () => {
    expect(listarDiasEntreDatas('2026-11-10T00:00:00Z', '2026-11-10')).toEqual(['2026-11-10']);
  });

  it('devolve vazio para entradas inválidas', () => {
    expect(listarDiasEntreDatas(null, '2026-11-10')).toEqual([]);
    expect(listarDiasEntreDatas('2026-11-12', '2026-11-10')).toEqual([]);
    expect(listarDiasEntreDatas('ontem', 'hoje')).toEqual([]);
  });
});
