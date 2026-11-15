import { describe, expect, it } from 'vitest';

import { normalizarVenda } from 'src/modules/financeiro/utils/normalizar-venda.util';

describe('normalizarVenda', () => {
  it('converte valores de moeda e mantém nulos', () => {
    expect(
      normalizarVenda({
        id: 'v',
        status: 'APROVADA',
        descricao: 'Curso',
        valor: { amountMicros: 497_000_000, currencyCode: 'BRL' },
        valorLiquido: { amountMicros: null, currencyCode: 'BRL' },
        dataEvento: '2026-11-10T13:00:00Z',
      }),
    ).toEqual({
      id: 'v',
      status: 'APROVADA',
      descricao: 'Curso',
      valor: 497,
      valorLiquido: null,
      dataEvento: '2026-11-10T13:00:00Z',
    });
  });

  it('aceita registro sem campos', () => {
    expect(normalizarVenda({ id: 'v' })).toEqual({
      id: 'v',
      status: null,
      descricao: null,
      valor: null,
      valorLiquido: null,
      dataEvento: null,
    });
  });
});
