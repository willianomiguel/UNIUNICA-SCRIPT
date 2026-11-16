import { describe, expect, it } from 'vitest';

import { computeMetricValue } from 'src/modules/avisos/utils/compute-metric-value.util';
import { getMetricWindow } from 'src/modules/avisos/utils/get-metric-window.util';

const WINDOW = getMetricWindow(new Date('2026-11-15T12:00:00Z'), 30);

describe('computeMetricValue', () => {
  const vendas = [
    { status: 'APROVADA', valor: { amountMicros: 100_000_000 } },
    { status: 'CHARGEBACK', valor: { amountMicros: 100_000_000 } },
    { status: 'RECUSADA', valor: { amountMicros: 100_000_000 } },
    { status: 'FALHA', valor: { amountMicros: 100_000_000 } },
  ];

  it('despacha para a métrica correta', () => {
    expect(computeMetricValue('TAXA_CHARGEBACK', vendas, WINDOW)).toBe(50);
    expect(computeMetricValue('TAXA_RECUSA', vendas, WINDOW)).toBe(50);
    expect(computeMetricValue('FATURAMENTO_DIA', vendas, WINDOW)).toBe(100);
    expect(computeMetricValue('VENDAS_DIA', vendas, WINDOW)).toBe(1);
    expect(computeMetricValue('GASTO_TRAFEGO_DIA', [{ data: '2026-11-15', gasto: { amountMicros: 5_000_000 } }], WINDOW)).toBe(5);
    expect(computeMetricValue('LANCAMENTOS_ATRASADOS', [{ status: 'ATRASADO' }], WINDOW)).toBe(1);
    expect(computeMetricValue('METAS_EM_RISCO', [{ status: 'EM_RISCO' }], WINDOW)).toBe(1);
    expect(computeMetricValue('SPRINT_ATRASADA', [{ status: 'ATIVA', dataFim: '2026-11-01' }], WINDOW)).toBe(1);
  });
});
