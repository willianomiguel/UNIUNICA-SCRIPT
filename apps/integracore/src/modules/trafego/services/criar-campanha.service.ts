import { executarGraphql } from 'src/modules/trafego/services/executar-graphql.service';
import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { mapearNoCampanha } from 'src/modules/trafego/utils/mapear-no-campanha.util';

export const criarCampanha = async (
  dados: Record<string, unknown>,
): Promise<CampanhaResumo> => {
  const resposta = await executarGraphql<{ createCampanha: Record<string, unknown> }>(
    `mutation CriarCampanha($data: CampanhaCreateInput!) {
      createCampanha(data: $data) { id nome plataforma status utmCampaign idExterno }
    }`,
    { data: dados },
  );

  return mapearNoCampanha(resposta.createCampanha);
};
