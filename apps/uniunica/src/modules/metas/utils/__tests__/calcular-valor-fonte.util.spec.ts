import { describe, expect, it } from 'vitest';

import { type DadosFontes } from 'src/modules/metas/types/dados-fontes';
import { calcularValorFonte } from 'src/modules/metas/utils/calcular-valor-fonte.util';

const brl = (reais: number) => ({ amountMicros: reais * 1_000_000, currencyCode: 'BRL' });

const dados: DadosFontes = {
  vendas: [
    { id: '1', status: 'APROVADA', valor: brl(100), valorLiquido: brl(90), dataEvento: '2026-10-05T10:00:00Z' },
    { id: '2', status: 'APROVADA', valor: brl(200), valorLiquido: { amountMicros: null }, dataEvento: '2026-11-05' },
    { id: '3', status: 'CHARGEBACK', valor: brl(50), dataEvento: '2026-11-06' },
    { id: '4', status: 'RECUSADA', valor: brl(999), dataEvento: '2026-11-07' },
    { id: '5', status: 'APROVADA', valor: brl(999), dataEvento: '2026-09-30' },
  ],
  lancamentos: [
    { id: 'a', tipo: 'ENTRADA', status: 'PAGO', valor: brl(1000), data: '2026-10-10' },
    { id: 'b', tipo: 'SAIDA', status: 'PAGO', valor: brl(300), data: '2026-10-11' },
    { id: 'c', tipo: 'SAIDA', status: 'PENDENTE', valor: brl(999), data: '2026-10-12' },
  ],
  metricasTrafego: [
    { id: 'x', data: '2026-10-01', leads: 10, cliques: 300 },
    { id: 'y', data: '2026-11-01', leads: '5', cliques: null },
    { id: 'z', data: '2027-01-01', leads: 99, cliques: 99 },
  ],
};

const calcular = (fonte: Parameters<typeof calcularValorFonte>[0]) =>
  calcularValorFonte(fonte, dados, '2026-10-01', '2026-12-31');

describe('calcularValorFonte', () => {
  it('faturamento bruto, líquido e vendas aprovadas no período', () => {
    expect(calcular('FATURAMENTO_BRUTO')).toBe(300);
    expect(calcular('FATURAMENTO_LIQUIDO')).toBe(290);
    expect(calcular('VENDAS_APROVADAS')).toBe(2);
  });

  it('taxa de chargeback sobre vendas concluídas', () => {
    expect(calcular('TAXA_CHARGEBACK')).toBe(33.33);
    expect(calcularValorFonte('TAXA_CHARGEBACK', { ...dados, vendas: [] }, null, null)).toBe(0);
  });

  it('lucro considera só lançamentos pagos', () => {
    expect(calcular('LUCRO')).toBe(700);
  });

  it('leads e cliques do tráfego', () => {
    expect(calcular('LEADS')).toBe(15);
    expect(calcular('CLIQUES')).toBe(300);
  });

  it('null para fonte manual ou objeto indisponível', () => {
    expect(calcular('MANUAL')).toBeNull();
    expect(
      calcularValorFonte('LEADS', { ...dados, metricasTrafego: null }, null, null),
    ).toBeNull();
    expect(calcularValorFonte('FATURAMENTO_BRUTO', { ...dados, vendas: null }, null, null)).toBeNull();
    expect(calcularValorFonte('LUCRO', { ...dados, lancamentos: null }, null, null)).toBeNull();
  });
});
