import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { type CampanhaResumo } from 'src/modules/trafego/types/campanha-resumo';
import { mapearNoCampanha } from 'src/modules/trafego/utils/mapear-no-campanha.util';

export const listarCampanhas = async (): Promise<CampanhaResumo[]> =>
  (
    await listarTodos({
      plural: 'campanhas',
      tipoFiltro: 'CampanhaFilterInput',
      campos: 'id nome plataforma status utmCampaign idExterno',
    })
  ).map(mapearNoCampanha);
