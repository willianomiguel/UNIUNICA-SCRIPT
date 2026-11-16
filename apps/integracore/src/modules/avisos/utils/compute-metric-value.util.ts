import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';
import { type MetricWindow } from 'src/modules/avisos/types/metric-window';
import { computeFaturamento } from 'src/modules/avisos/utils/compute-faturamento.util';
import { computeTaxaChargeback } from 'src/modules/avisos/utils/compute-taxa-chargeback.util';
import { computeTaxaRecusa } from 'src/modules/avisos/utils/compute-taxa-recusa.util';
import { countLancamentosAtrasados } from 'src/modules/avisos/utils/count-lancamentos-atrasados.util';
import { countMetasEmRisco } from 'src/modules/avisos/utils/count-metas-em-risco.util';
import { countSprintsAtrasadas } from 'src/modules/avisos/utils/count-sprints-atrasadas.util';
import { countVendasAprovadas } from 'src/modules/avisos/utils/count-vendas-aprovadas.util';
import { sumGastoTrafego } from 'src/modules/avisos/utils/sum-gasto-trafego.util';

// Calcula a métrica a partir dos registros lidos com getMetricQuery.
export const computeMetricValue = (
  metrica: AlertaMetrica,
  records: Array<Record<string, unknown>>,
  window: MetricWindow,
): number => {
  switch (metrica) {
    case 'TAXA_CHARGEBACK':
      return computeTaxaChargeback(records);
    case 'TAXA_RECUSA':
      return computeTaxaRecusa(records);
    case 'FATURAMENTO_DIA':
      return computeFaturamento(records);
    case 'VENDAS_DIA':
      return countVendasAprovadas(records);
    case 'GASTO_TRAFEGO_DIA':
      return sumGastoTrafego(records, window.today);
    case 'LANCAMENTOS_ATRASADOS':
      return countLancamentosAtrasados(records, window.today);
    case 'METAS_EM_RISCO':
      return countMetasEmRisco(records);
    case 'SPRINT_ATRASADA':
      return countSprintsAtrasadas(records, window.today);
  }
};
