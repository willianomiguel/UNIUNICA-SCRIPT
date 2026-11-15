import { describe, expect, it } from 'vitest';

import { normalizarCategoria } from 'src/modules/financeiro/utils/normalizar-categoria.util';

describe('normalizarCategoria', () => {
  it('converte o registro da API', () => {
    expect(
      normalizarCategoria({
        id: 'c',
        nome: 'Impostos',
        tipo: 'SAIDA',
        orcamentoMensal: { amountMicros: 3_000_000_000, currencyCode: 'BRL' },
      }),
    ).toEqual({ id: 'c', nome: 'Impostos', tipo: 'SAIDA', orcamentoMensal: 3000 });
  });

  it('usa padrões quando faltam dados', () => {
    expect(normalizarCategoria({ id: 'c', tipo: 'ENTRADA' })).toEqual({
      id: 'c',
      nome: 'Sem nome',
      tipo: 'ENTRADA',
      orcamentoMensal: 0,
    });
  });
});
