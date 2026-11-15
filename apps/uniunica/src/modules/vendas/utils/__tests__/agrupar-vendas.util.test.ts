import { describe, expect, it } from 'vitest';

import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { agruparVendas } from 'src/modules/vendas/utils/agrupar-vendas.util';

const venda = (parcial: Partial<VendaParaMetricas>): VendaParaMetricas => ({
  status: 'APROVADA',
  gateway: 'STRIPE',
  metodoPagamento: 'PIX',
  valor: 10,
  valorLiquido: null,
  taxaGateway: null,
  dataEvento: null,
  ...parcial,
});

describe('agruparVendas', () => {
  it('totals count and amount per key, sorted by amount', () => {
    const grupos = agruparVendas(
      [
        venda({ gateway: 'STRIPE', valor: 10.1 }),
        venda({ gateway: 'ASAAS', valor: 50 }),
        venda({ gateway: 'STRIPE', valor: 10.2 }),
      ],
      'gateway',
    );

    expect(grupos).toEqual([
      { chave: 'ASAAS', quantidade: 1, valor: 50 },
      { chave: 'STRIPE', quantidade: 2, valor: 20.3 },
    ]);
  });

  it('groups missing values under SEM_VALOR', () => {
    expect(agruparVendas([venda({ metodoPagamento: null })], 'metodoPagamento')).toEqual([
      { chave: 'SEM_VALOR', quantidade: 1, valor: 10 },
    ]);
  });

  it('returns an empty list for no sales', () => {
    expect(agruparVendas([], 'status')).toEqual([]);
  });
});
