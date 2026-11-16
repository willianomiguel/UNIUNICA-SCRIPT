import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';

export const ALERTA_METRICA_LABELS: Record<AlertaMetrica, string> = {
  TAXA_CHARGEBACK: 'Taxa de chargeback',
  TAXA_RECUSA: 'Taxa de recusa',
  FATURAMENTO_DIA: 'Faturamento do dia',
  VENDAS_DIA: 'Vendas do dia',
  GASTO_TRAFEGO_DIA: 'Gasto de tráfego do dia',
  LANCAMENTOS_ATRASADOS: 'Lançamentos atrasados',
  METAS_EM_RISCO: 'Metas em risco',
  SPRINT_ATRASADA: 'Sprints atrasadas',
};
