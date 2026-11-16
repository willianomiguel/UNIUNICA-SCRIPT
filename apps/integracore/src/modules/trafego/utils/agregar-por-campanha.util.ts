import { SEM_CAMPANHA } from 'src/modules/trafego/constants/trafego-constantes';
import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { agruparMetricas } from 'src/modules/trafego/utils/agrupar-metricas.util';

// Totais por campanhaId; métricas sem campanha ficam em SEM_CAMPANHA.
export const agregarPorCampanha = (
  linhas: LinhaMetrica[],
): Record<string, TotaisMetricas> =>
  agruparMetricas(linhas, (linha) => linha.campanhaId ?? SEM_CAMPANHA);
