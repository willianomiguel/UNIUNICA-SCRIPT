import { describe, expect, it } from 'vitest';

import { montarResumoVendas } from 'src/modules/assistente/utils/montar-resumo-vendas.util';
import { obterIntervaloAnteriorIso } from 'src/modules/assistente/utils/obter-intervalo-anterior-iso.util';
import { type VendaParaMetricas } from 'src/modules/vendas/types/venda-para-metricas';

const venda = (dados: Partial<VendaParaMetricas>): VendaParaMetricas => ({
  status: 'APROVADA',
  gateway: 'STRIPE',
  metodoPagamento: 'PIX',
  valor: 100,
  valorLiquido: 95,
  taxaGateway: 5,
  dataEvento: '2026-11-10T15:00:00.000Z',
  ...dados,
});

const intervalo = { inicio: '2026-11-01', fim: '2026-11-15' };

describe('obterIntervaloAnteriorIso', () => {
  it('tem a mesma duração e termina na véspera do início', () => {
    expect(obterIntervaloAnteriorIso(intervalo)).toEqual({ inicio: '2026-10-17', fim: '2026-10-31' });
  });
});

describe('montarResumoVendas', () => {
  it('período vazio dá zeros e variação null', () => {
    const resumo = montarResumoVendas({ vendas: [], intervalo });

    expect(resumo).toMatchObject({
      faturamentoBruto: 0,
      faturamentoLiquido: 0,
      quantidadeAprovadas: 0,
      ticketMedio: 0,
      porGateway: [],
      variacaoFaturamentoBruto: null,
      variacaoQuantidade: null,
    });
  });

  it('soma o período, compara com o anterior e quebra por gateway', () => {
    const resumo = montarResumoVendas({
      vendas: [
        venda({}),
        venda({ valor: 300, valorLiquido: 280, gateway: 'ASAAS' }),
        venda({ status: 'REEMBOLSADA', valor: 50, valorLiquido: null }),
        venda({ status: 'PENDENTE', valor: 999 }),
        venda({ dataEvento: '2026-10-20T15:00:00.000Z', valor: 200 }),
        venda({ dataEvento: '2026-09-01T15:00:00.000Z', valor: 5000 }),
      ],
      intervalo,
    });

    expect(resumo.faturamentoBruto).toBe(450);
    expect(resumo.faturamentoLiquido).toBe(375);
    expect(resumo.quantidadeAprovadas).toBe(2);
    expect(resumo.quantidadePagas).toBe(3);
    expect(resumo.ticketMedio).toBe(150);
    expect(resumo.quantidadeReembolsos).toBe(1);
    expect(resumo.anterior.faturamentoBruto).toBe(200);
    expect(resumo.variacaoFaturamentoBruto).toBe(1.25);
    expect(resumo.porGateway[0]).toMatchObject({ chave: 'ASAAS', valor: 300 });
  });
});
