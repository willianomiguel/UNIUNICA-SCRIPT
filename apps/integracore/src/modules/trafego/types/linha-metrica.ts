import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';

// Métrica lida do banco para agregação (gasto já em reais).
export type LinhaMetrica = TotaisMetricas & {
  data: string | null;
  campanhaId: string | null;
  origem: string | null;
};
