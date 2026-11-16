import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';
import { type MetricQuery } from 'src/modules/avisos/types/metric-query';
import { type MetricWindow } from 'src/modules/avisos/types/metric-window';

// Qual objeto ler (API REST) e com qual filtro, para calcular cada métrica.
export const getMetricQuery = (metrica: AlertaMetrica, window: MetricWindow): MetricQuery => {
  switch (metrica) {
    case 'TAXA_CHARGEBACK':
    case 'TAXA_RECUSA':
      return { path: '/rest/vendas', filter: `dataEvento[gte]:"${window.windowStartIso}"` };
    case 'FATURAMENTO_DIA':
    case 'VENDAS_DIA':
      return { path: '/rest/vendas', filter: `dataEvento[gte]:"${window.startOfTodayIso}"` };
    case 'GASTO_TRAFEGO_DIA':
      return { path: '/rest/metricasTrafego', filter: `data[eq]:"${window.today}"` };
    case 'LANCAMENTOS_ATRASADOS':
      return { path: '/rest/lancamentos', filter: 'status[in]:[ATRASADO,PENDENTE]' };
    case 'METAS_EM_RISCO':
      return { path: '/rest/metas', filter: 'status[in]:[EM_RISCO,ATRASADA]' };
    case 'SPRINT_ATRASADA':
      return { path: '/rest/sprints', filter: `dataFim[lt]:"${window.today}"` };
  }
};
