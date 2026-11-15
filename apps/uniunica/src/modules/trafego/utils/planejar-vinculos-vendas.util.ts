import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';
import { encontrarCampanhaPorUtm } from 'src/modules/trafego/utils/encontrar-campanha-por-utm.util';

// Para cada venda sem campanha com utm_campaign, acha a campanha de mesmo utmCampaign.
export const planejarVinculosVendas = (
  vendas: Pick<VendaResumo, 'id' | 'campanhaId' | 'utmCampaign'>[],
  campanhas: CampanhaResumo[],
): Array<{ vendaId: string; campanhaId: string }> =>
  vendas.flatMap((venda) => {
    if (venda.campanhaId || !venda.utmCampaign) {
      return [];
    }

    const campanha = encontrarCampanhaPorUtm(campanhas, venda.utmCampaign);

    return campanha ? [{ vendaId: venda.id, campanhaId: campanha.id }] : [];
  });
