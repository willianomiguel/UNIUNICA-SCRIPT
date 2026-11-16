import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';

export const totaisVazios = (): TotaisMetricas => ({
  impressoes: 0,
  cliques: 0,
  visitas: 0,
  leads: 0,
  conversoes: 0,
  gasto: 0,
});
