import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { totaisVazios } from 'src/modules/trafego/utils/totais-vazios.util';

export const somarMetricas = (linhas: TotaisMetricas[]): TotaisMetricas =>
  linhas.reduce<TotaisMetricas>(
    (acumulado, linha) => ({
      impressoes: acumulado.impressoes + (linha.impressoes || 0),
      cliques: acumulado.cliques + (linha.cliques || 0),
      visitas: acumulado.visitas + (linha.visitas || 0),
      leads: acumulado.leads + (linha.leads || 0),
      conversoes: acumulado.conversoes + (linha.conversoes || 0),
      gasto: acumulado.gasto + (linha.gasto || 0),
    }),
    totaisVazios(),
  );
