import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type ReferenciaCampanha } from 'src/modules/trafego/types/referencia-campanha';
import { encontrarCampanhaPorUtm } from 'src/modules/trafego/utils/encontrar-campanha-por-utm.util';

const igual = (a: string | null | undefined, b: string | null | undefined) =>
  Boolean(a) && Boolean(b) && a!.trim().toLowerCase() === b!.trim().toLowerCase();

// Ordem de busca: id do IntegraCore → ID na plataforma → utm_campaign → nome.
export const encontrarCampanhaPorReferencia = (
  campanhas: CampanhaResumo[],
  referencia: ReferenciaCampanha | null | undefined,
): CampanhaResumo | null => {
  if (!referencia) {
    return null;
  }

  return (
    (referencia.id && campanhas.find((campanha) => campanha.id === referencia.id)) ||
    (referencia.idExterno &&
      campanhas.find((campanha) => igual(campanha.idExterno, referencia.idExterno))) ||
    encontrarCampanhaPorUtm(campanhas, referencia.utmCampaign) ||
    (referencia.nome && campanhas.find((campanha) => igual(campanha.nome, referencia.nome))) ||
    null
  );
};
