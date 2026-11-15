import { describe, expect, it } from 'vitest';

import { normalizarLancamento } from 'src/modules/financeiro/utils/normalizar-lancamento.util';

describe('normalizarLancamento', () => {
  it('converte o registro da API', () => {
    expect(
      normalizarLancamento({
        id: '1',
        descricao: 'Meta Ads',
        tipo: 'SAIDA',
        valor: { amountMicros: '-2500000000', currencyCode: 'BRL' },
        data: '2026-11-10',
        vencimento: '2026-11-20T00:00:00Z',
        status: 'PENDENTE',
        recorrencia: 'MENSAL',
        centroCusto: 'MARKETING',
        categoriaId: 'cat',
      }),
    ).toEqual({
      id: '1',
      descricao: 'Meta Ads',
      tipo: 'SAIDA',
      valor: 2500,
      data: '2026-11-10',
      vencimento: '2026-11-20',
      status: 'PENDENTE',
      recorrencia: 'MENSAL',
      centroCusto: 'MARKETING',
      categoriaId: 'cat',
    });
  });

  it('preenche padrões para campos vazios', () => {
    expect(normalizarLancamento({ id: '2', tipo: 'ENTRADA', valor: null })).toEqual({
      id: '2',
      descricao: '',
      tipo: 'ENTRADA',
      valor: 0,
      data: null,
      vencimento: null,
      status: 'PENDENTE',
      recorrencia: 'NENHUMA',
      centroCusto: null,
      categoriaId: null,
    });
  });
});
