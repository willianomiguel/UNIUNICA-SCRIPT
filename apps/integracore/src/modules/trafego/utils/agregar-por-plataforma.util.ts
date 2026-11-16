import { type LinhaMetrica } from 'src/modules/trafego/types/linha-metrica';
import { type TotaisMetricas } from 'src/modules/trafego/types/totais-metricas';
import { agruparMetricas } from 'src/modules/trafego/utils/agrupar-metricas.util';

// Usa a plataforma da campanha; sem campanha, cai na origem da métrica (ex.: SITE).
export const agregarPorPlataforma = (
  linhas: LinhaMetrica[],
  plataformaPorCampanha: Record<string, string | null>,
): Record<string, TotaisMetricas> =>
  agruparMetricas(linhas, (linha) => {
    const plataforma = linha.campanhaId
      ? plataformaPorCampanha[linha.campanhaId]
      : null;

    return plataforma ?? linha.origem ?? 'OUTRO';
  });
