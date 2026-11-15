import { executarGraphql } from 'src/modules/trafego/services/executar-graphql.service';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { type EventoPixel } from 'src/modules/trafego/types/evento-pixel';
import { dataNoFuso } from 'src/modules/trafego/utils/data-no-fuso.util';
import { encontrarCampanhaPorUtm } from 'src/modules/trafego/utils/encontrar-campanha-por-utm.util';
import { mapearMetricaParaRegistro } from 'src/modules/trafego/utils/mapear-metrica-para-registro.util';
import { montarChaveMetrica } from 'src/modules/trafego/utils/montar-chave-metrica.util';

// Soma +1 visita (ou clique) na linha de hoje da página (origem SITE), criando-a se preciso.
// Leitura+escrita não é atômica: aceitável para o volume de um site pequeno.
export const registrarEventoPixel = async (
  evento: EventoPixel,
  agora: Date = new Date(),
): Promise<{ chave: string; visitas: number; cliques: number }> => {
  const data = dataNoFuso(agora);
  const referencia = evento.utmCampaign
    ? `${evento.pagina}|${evento.utmCampaign}`
    : evento.pagina;
  const chave = montarChaveMetrica({ origem: 'SITE', referencia, data });
  const campoIncrementado = evento.tipo === 'CLIQUE' ? 'cliques' : 'visitas';

  const [existente] = await listarTodos({
    plural: 'metricasTrafego',
    tipoFiltro: 'MetricaTrafegoFilterInput',
    campos: 'id visitas cliques',
    filtro: { chave: { eq: chave } },
    limite: 1,
  });

  if (existente) {
    const visitas = (Number(existente.visitas) || 0) + (campoIncrementado === 'visitas' ? 1 : 0);
    const cliques = (Number(existente.cliques) || 0) + (campoIncrementado === 'cliques' ? 1 : 0);

    await executarGraphql(
      `mutation Incrementar($id: UUID!, $data: MetricaTrafegoUpdateInput!) {
        updateMetricaTrafego(id: $id, data: $data) { id }
      }`,
      { id: existente.id, data: { visitas, cliques } },
    );

    return { chave, visitas, cliques };
  }

  const campanha = evento.utmCampaign
    ? encontrarCampanhaPorUtm(await listarCampanhas(), evento.utmCampaign)
    : null;
  const visitas = campoIncrementado === 'visitas' ? 1 : 0;
  const cliques = campoIncrementado === 'cliques' ? 1 : 0;

  await executarGraphql(
    `mutation CriarMetrica($data: MetricaTrafegoCreateInput!) {
      createMetricaTrafego(data: $data) { id }
    }`,
    {
      data: mapearMetricaParaRegistro(
        {
          chave,
          data,
          origem: 'SITE',
          impressoes: 0,
          cliques,
          visitas,
          leads: 0,
          conversoes: 0,
          gasto: 0,
          pagina: evento.pagina,
          campanha: evento.utmCampaign ? { utmCampaign: evento.utmCampaign } : null,
        },
        campanha,
      ),
    },
  );

  return { chave, visitas, cliques };
};
