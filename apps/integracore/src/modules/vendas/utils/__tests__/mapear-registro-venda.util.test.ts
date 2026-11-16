import { describe, expect, it } from 'vitest';

import { mapearRegistroVenda } from 'src/modules/vendas/utils/mapear-registro-venda.util';

describe('mapearRegistroVenda', () => {
  it('converts currency micros and keeps known select values', () => {
    expect(
      mapearRegistroVenda({
        id: '1',
        status: 'APROVADA',
        gateway: 'STRIPE',
        metodoPagamento: 'PIX',
        valor: { amountMicros: 197_000_000, currencyCode: 'BRL' },
        valorLiquido: { amountMicros: '187500000', currencyCode: 'BRL' },
        taxaGateway: null,
        dataEvento: '2026-11-10T00:00:00.000Z',
      }),
    ).toEqual({
      status: 'APROVADA',
      gateway: 'STRIPE',
      metodoPagamento: 'PIX',
      valor: 197,
      valorLiquido: 187.5,
      taxaGateway: null,
      dataEvento: '2026-11-10T00:00:00.000Z',
    });
  });

  it('defaults missing amounts to zero and unknown values to null', () => {
    expect(mapearRegistroVenda({ id: '1', status: 'OUTRA_COISA' })).toEqual({
      status: null,
      gateway: null,
      metodoPagamento: null,
      valor: 0,
      valorLiquido: null,
      taxaGateway: null,
      dataEvento: null,
    });
  });
});
