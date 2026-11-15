import { describe, expect, it } from 'vitest';

import { normalizarMeta } from 'src/modules/metas/utils/normalizar-meta.util';

describe('normalizarMeta', () => {
  it('converte o registro da API', () => {
    expect(
      normalizarMeta({
        id: 'm',
        titulo: 'Faturamento',
        fonte: 'FATURAMENTO_BRUTO',
        unidade: 'REAIS',
        periodo: '2026-T4',
        dataInicio: '2026-10-01',
        dataFim: '2026-12-31',
        valorInicial: 0,
        valorAlvo: '150000',
        valorAtual: 1000.5,
        progresso: 0.7,
        status: 'EM_RISCO',
        metaPaiId: 'pai',
      }),
    ).toEqual({
      id: 'm',
      titulo: 'Faturamento',
      fonte: 'FATURAMENTO_BRUTO',
      unidade: 'REAIS',
      periodo: '2026-T4',
      dataInicio: '2026-10-01',
      dataFim: '2026-12-31',
      valorInicial: 0,
      valorAlvo: 150000,
      valorAtual: 1000.5,
      progresso: 0.7,
      status: 'EM_RISCO',
      metaPaiId: 'pai',
    });
  });

  it('usa padrões para campos vazios', () => {
    expect(normalizarMeta({ id: 'm' })).toMatchObject({
      titulo: 'Meta sem título',
      fonte: 'MANUAL',
      unidade: 'QUANTIDADE',
      valorInicial: 0,
      valorAlvo: null,
      valorAtual: null,
      status: null,
      metaPaiId: null,
    });
  });
});
