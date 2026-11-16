import { type MetricWindow } from 'src/modules/avisos/types/metric-window';

// Brasil (São Paulo) está em UTC-3 fixo desde o fim do horário de verão em 2019.
const SAO_PAULO_OFFSET_HOURS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export const getMetricWindow = (now: Date, janelaDias: number): MetricWindow => {
  const today = new Date(now.getTime() - SAO_PAULO_OFFSET_HOURS * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const days = Number.isFinite(janelaDias) && janelaDias > 0 ? janelaDias : 1;

  return {
    today,
    startOfTodayIso: `${today}T00:00:00-03:00`,
    windowStartIso: new Date(now.getTime() - days * DAY_MS).toISOString(),
  };
};
