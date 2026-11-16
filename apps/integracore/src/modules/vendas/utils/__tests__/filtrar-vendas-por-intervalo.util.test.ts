import { describe, expect, it } from 'vitest';

import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { filtrarVendasPorIntervalo } from 'src/modules/vendas/utils/filtrar-vendas-por-intervalo.util';

const venda = (dataEvento: string | null): VendaParaMetricas => ({
  status: 'APROVADA',
  gateway: null,
  metodoPagamento: null,
  valor: 1,
  valorLiquido: null,
  taxaGateway: null,
  dataEvento,
});

describe('filtrarVendasPorIntervalo', () => {
  it('keeps the start, drops the end, missing and invalid dates', () => {
    const intervalo = {
      inicio: new Date('2026-11-01T00:00:00Z'),
      fim: new Date('2026-11-02T00:00:00Z'),
    };
    const resultado = filtrarVendasPorIntervalo(
      [
        venda('2026-11-01T00:00:00Z'),
        venda('2026-11-01T23:59:59Z'),
        venda('2026-11-02T00:00:00Z'),
        venda(null),
        venda('não é data'),
      ],
      intervalo,
    );

    expect(resultado.map((item) => item.dataEvento)).toEqual([
      '2026-11-01T00:00:00Z',
      '2026-11-01T23:59:59Z',
    ]);
  });
});
