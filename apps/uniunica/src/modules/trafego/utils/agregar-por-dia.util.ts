import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { agruparMetricas } from 'src/modules/trafego/utils/agrupar-metricas.util';

// Série diária ordenada por data (linhas sem data ficam de fora).
export const agregarPorDia = (
  linhas: LinhaMetrica[],
): Array<{ data: string; totais: TotaisMetricas }> => {
  const grupos = agruparMetricas(
    linhas.filter((linha) => Boolean(linha.data)),
    (linha) => (linha.data as string).slice(0, 10),
  );

  return Object.entries(grupos)
    .map(([data, totais]) => ({ data, totais }))
    .sort((a, b) => a.data.localeCompare(b.data));
};
