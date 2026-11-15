import { describe, expect, it } from 'vitest';

import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { agruparVendasPorDia } from 'src/modules/vendas/utils/agrupar-vendas-por-dia.util';

const venda = (parcial: Partial<VendaParaMetricas>): VendaParaMetricas => ({
  status: 'APROVADA',
  gateway: null,
  metodoPagamento: null,
  valor: 10,
  valorLiquido: null,
  taxaGateway: null,
  dataEvento: new Date(2026, 10, 2, 10).toISOString(),
  ...parcial,
});

describe('agruparVendasPorDia', () => {
  it('lists every day of the interval and sums paid and refused sales', () => {
    const dias = agruparVendasPorDia(
      [
        venda({}),
        venda({ status: 'CHARGEBACK', valor: 5 }),
        venda({ status: 'RECUSADA' }),
        venda({ status: 'PENDENTE' }),
        venda({ dataEvento: null }),
        venda({ dataEvento: new Date(2026, 9, 1).toISOString() }),
      ],
      { inicio: new Date(2026, 10, 1), fim: new Date(2026, 10, 3, 12) },
    );

    expect(dias).toEqual([
      { dia: '2026-11-01', faturamento: 0, pagas: 0, recusadas: 0 },
      { dia: '2026-11-02', faturamento: 15, pagas: 2, recusadas: 1 },
      { dia: '2026-11-03', faturamento: 0, pagas: 0, recusadas: 0 },
    ]);
  });
});
