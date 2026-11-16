import { ROTULO_ORIGEM_METRICA } from 'src/modules/trafego/constants/trafego-constantes';
import { type MetricaNormalizada } from 'src/modules/trafego/types/metrica-normalizada';

// Texto legível da linha, ex.: "Meta Ads · Black Friday · 2026-11-14".
export const montarNomeMetrica = (
  metrica: Pick<MetricaNormalizada, 'origem' | 'data' | 'pagina' | 'campanha'>,
  nomeCampanha?: string | null,
): string => {
  const alvo =
    nomeCampanha ??
    metrica.campanha?.nome ??
    metrica.campanha?.utmCampaign ??
    metrica.pagina ??
    metrica.campanha?.idExterno ??
    'Geral';

  return `${ROTULO_ORIGEM_METRICA[metrica.origem]} · ${alvo} · ${metrica.data}`;
};
