import { describe, expect, it } from 'vitest';

import { type VendaResumo } from 'src/modules/financeiro/types/venda-resumo';
import { montarLancamentoVenda } from 'src/modules/financeiro/utils/montar-lancamento-venda.util';

const venda = (dados: Partial<VendaResumo>): VendaResumo => ({
  id: 'venda-1',
  status: 'APROVADA',
  descricao: 'Curso X',
  valor: 497,
  valorLiquido: 450.5,
  dataEvento: '2026-11-10T13:00:00Z',
  ...dados,
});

describe('montarLancamentoVenda', () => {
  it('venda aprovada gera ENTRADA paga com valor líquido', () => {
    expect(montarLancamentoVenda(venda({}), '2026-11-15')).toEqual({
      descricao: 'Venda: Curso X',
      tipo: 'ENTRADA',
      valor: { amountMicros: 450_500_000, currencyCode: 'BRL' },
      data: '2026-11-10',
      vencimento: '2026-11-10',
      status: 'PAGO',
      recorrencia: 'NENHUMA',
      origem: 'VENDA',
      vendaId: 'venda-1',
      chaveIdempotencia: 'venda:venda-1:entrada',
    });
  });

  it('usa o valor bruto e a data de hoje quando faltam dados', () => {
    const payload = montarLancamentoVenda(
      venda({ valorLiquido: null, dataEvento: null, descricao: null }),
      '2026-11-15',
    );

    expect(payload?.valor.amountMicros).toBe(497_000_000);
    expect(payload?.data).toBe('2026-11-15');
    expect(payload?.descricao).toBe('Venda: Venda venda-1');
  });

  it('reembolso e chargeback geram SAÍDA com a mesma chave de estorno', () => {
    const reembolso = montarLancamentoVenda(venda({ status: 'REEMBOLSADA' }), '2026-11-15');
    const chargeback = montarLancamentoVenda(venda({ status: 'CHARGEBACK' }), '2026-11-15');

    expect(reembolso).toMatchObject({
      tipo: 'SAIDA',
      descricao: 'Reembolso: Curso X',
      data: '2026-11-15',
      chaveIdempotencia: 'venda:venda-1:estorno',
    });
    expect(chargeback?.descricao).toBe('Chargeback: Curso X');
    expect(chargeback?.chaveIdempotencia).toBe(reembolso?.chaveIdempotencia);
  });

  it('outros status ou valor ausente não geram lançamento', () => {
    expect(montarLancamentoVenda(venda({ status: 'PENDENTE' }), '2026-11-15')).toBeNull();
    expect(montarLancamentoVenda(venda({ status: null }), '2026-11-15')).toBeNull();
    expect(
      montarLancamentoVenda(venda({ valor: null, valorLiquido: null }), '2026-11-15'),
    ).toBeNull();
    expect(montarLancamentoVenda(venda({ valorLiquido: 0, valor: 0 }), '2026-11-15')).toBeNull();
  });
});
