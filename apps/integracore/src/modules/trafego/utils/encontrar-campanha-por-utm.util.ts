import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { normalizarUtm } from 'src/modules/trafego/utils/normalizar-utm.util';

// Devolve a campanha cujo utmCampaign bate com o informado (ignorando maiúsculas/acentos).
export const encontrarCampanhaPorUtm = (
  campanhas: CampanhaResumo[],
  utmCampaign: string | null | undefined,
): CampanhaResumo | null => {
  const alvo = normalizarUtm(utmCampaign);

  if (!alvo) {
    return null;
  }

  return (
    campanhas.find((campanha) => normalizarUtm(campanha.utmCampaign) === alvo) ??
    null
  );
};
