import { describe, expect, it } from 'vitest';

import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';
import { calcularMetricasVendas } from 'src/modules/vendas/utils/calcular-metricas-vendas.util';

const venda = (parcial: Partial<VendaParaMetricas>): VendaParaMetricas => ({
  status: 'APROVADA',
  gateway: 'STRIPE',
  metodoPagamento: 'PIX',
  valor: 100,
  valorLiquido: null,
  taxaGateway: null,
  dataEvento: '2026-11-10T12:00:00.000Z',
  ...parcial,
});

describe('calcularMetricasVendas', () => {
  it('returns zeros for an empty list without dividing by zero', () => {
    const metricas = calcularMetricasVendas([]);

    expect(metricas.faturamentoBruto).toBe(0);
    expect(metricas.ticketMedio).toBe(0);
    expect(metricas.taxaAprovacao).toBe(0);
    expect(metricas.percentualChargeback).toBe(0);
  });

  it('computes revenue, fees, rates and average ticket', () => {
    const metricas = calcularMetricasVendas([
      venda({ valor: 200, valorLiquido: 190, taxaGateway: 10 }),
      venda({ valor: 100, taxaGateway: 5 }),
      venda({ status: 'REEMBOLSADA', valor: 50, taxaGateway: 2 }),
      venda({ status: 'CHARGEBACK', valor: 150 }),
      venda({ status: 'RECUSADA', valor: 80 }),
      venda({ status: 'FALHA', valor: 20 }),
      venda({ status: 'PENDENTE', valor: 60 }),
      venda({ status: 'CANCELADA', valor: 30 }),
    ]);

    expect(metricas.totalRegistros).toBe(8);
    expect(metricas.quantidadePagas).toBe(4);
    expect(metricas.faturamentoBruto).toBe(500);
    expect(metricas.faturamentoLiquido).toBe(285);
    expect(metricas.totalTaxas).toBe(17);
    expect(metricas.valorReembolsado).toBe(50);
    expect(metricas.valorChargeback).toBe(150);
    expect(metricas.valorPendente).toBe(60);
    expect(metricas.valorRecusado).toBe(100);
    expect(metricas.quantidadeRecusadas).toBe(2);
    expect(metricas.quantidadePendentes).toBe(1);
    expect(metricas.ticketMedio).toBe(125);
    expect(metricas.taxaAprovacao).toBeCloseTo(4 / 6);
    expect(metricas.taxaRecusa).toBeCloseTo(2 / 6);
    expect(metricas.percentualChargeback).toBe(0.25);
    expect(metricas.percentualReembolso).toBe(0.25);
  });

  it('skips records without status', () => {
    const metricas = calcularMetricasVendas([venda({ status: null })]);

    expect(metricas.totalRegistros).toBe(1);
    expect(metricas.quantidadePagas).toBe(0);
  });
});
