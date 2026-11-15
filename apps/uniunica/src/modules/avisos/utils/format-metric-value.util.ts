import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';

const PERCENT_METRICS = new Set<AlertaMetrica>(['TAXA_CHARGEBACK', 'TAXA_RECUSA']);
const MONEY_METRICS = new Set<AlertaMetrica>(['FATURAMENTO_DIA', 'GASTO_TRAFEGO_DIA']);

const formatNumber = (value: number, fractionDigits: number): string =>
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const formatMetricValue = (metrica: AlertaMetrica | null, value: number): string => {
  if (metrica !== null && PERCENT_METRICS.has(metrica)) {
    return `${formatNumber(value, 2)}%`;
  }

  if (metrica !== null && MONEY_METRICS.has(metrica)) {
    return `R$ ${formatNumber(value, 2)}`;
  }

  return Number.isInteger(value) ? formatNumber(value, 0) : formatNumber(value, 2);
};
