import { describe, expect, it } from 'vitest';

import { agruparMetasPorPeriodo } from 'src/modules/metas/utils/agrupar-metas-por-periodo.util';
import { type MetaResumo } from 'src/modules/metas/types/meta-resumo';

const meta = (dados: Partial<MetaResumo>): MetaResumo => ({
  id: 'm',
  titulo: 'Meta',
  fonte: 'MANUAL',
  unidade: 'QUANTIDADE',
  periodo: null,
  dataInicio: '2026-10-01',
  dataFim: '2026-12-31',
  valorInicial: 0,
  valorAlvo: 100,
  valorAtual: 0,
  progresso: null,
  status: null,
  metaPaiId: null,
  ...dados,
});

describe('agruparMetasPorPeriodo', () => {
  it('agrupa só metas principais, períodos recentes primeiro e "Sem período" no fim', () => {
    const grupos = agruparMetasPorPeriodo([
      meta({ id: '1', titulo: 'B', periodo: '2026-T3' }),
      meta({ id: '2', titulo: 'Z', periodo: '2026-T4' }),
      meta({ id: '3', titulo: 'A', periodo: '2026-T4' }),
      meta({ id: '4', titulo: 'Sub', periodo: '2026-T4', metaPaiId: '3' }),
      meta({ id: '5', titulo: 'Solta', periodo: null }),
      meta({ id: '6', titulo: 'Órfã', periodo: '2026-T4', metaPaiId: 'apagada' }),
    ]);

    expect(grupos.map((grupo) => [grupo.periodo, grupo.metas.map((item) => item.titulo)])).toEqual([
      ['2026-T4', ['A', 'Órfã', 'Z']],
      ['2026-T3', ['B']],
      ['Sem período', ['Solta']],
    ]);
  });
});
