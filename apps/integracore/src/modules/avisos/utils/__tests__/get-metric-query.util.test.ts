import { describe, expect, it } from 'vitest';

import { getMetricQuery } from 'src/modules/avisos/utils/get-metric-query.util';
import { getMetricWindow } from 'src/modules/avisos/utils/get-metric-window.util';

const WINDOW = getMetricWindow(new Date('2026-11-15T12:00:00Z'), 30);

describe('getMetricQuery', () => {
  it('lê vendas da janela para taxas e de hoje para métricas diárias', () => {
    expect(getMetricQuery('TAXA_CHARGEBACK', WINDOW)).toEqual({
      path: '/rest/vendas',
      filter: 'dataEvento[gte]:"2026-10-16T12:00:00.000Z"',
    });
    expect(getMetricQuery('FATURAMENTO_DIA', WINDOW).filter).toBe('dataEvento[gte]:"2026-11-15T00:00:00-03:00"');
  });

  it('aponta cada métrica para o objeto certo', () => {
    expect(getMetricQuery('GASTO_TRAFEGO_DIA', WINDOW)).toEqual({ path: '/rest/metricasTrafego', filter: 'data[eq]:"2026-11-15"' });
    expect(getMetricQuery('LANCAMENTOS_ATRASADOS', WINDOW).path).toBe('/rest/lancamentos');
    expect(getMetricQuery('METAS_EM_RISCO', WINDOW).path).toBe('/rest/metas');
    expect(getMetricQuery('SPRINT_ATRASADA', WINDOW)).toEqual({ path: '/rest/sprints', filter: 'dataFim[lt]:"2026-11-15"' });
  });
});
