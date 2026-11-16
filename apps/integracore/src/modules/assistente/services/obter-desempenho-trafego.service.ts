import { type DesempenhoTrafego } from 'src/modules/assistente/types/desempenho-trafego';
import { type IntervaloIso } from 'src/modules/assistente/types/intervalo-iso';
import { montarDesempenhoTrafego } from 'src/modules/assistente/utils/montar-desempenho-trafego.util';
import { STATUS_VENDA_APROVADA } from 'src/modules/trafego/constants/trafego-constantes';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { mapearNoMetrica } from 'src/modules/trafego/utils/mapear-no-metrica.util';
import { mapearNoVenda } from 'src/modules/trafego/utils/mapear-no-venda.util';
import { somarDias } from 'src/modules/trafego/utils/somar-dias.util';

// Mesma leitura do painel de Tráfego (campanhas, métricas e vendas aprovadas ligadas a campanhas),
// mas também limitada pelo fim do período.
export const obterDesempenhoTrafego = async (
  intervalo: IntervaloIso,
  campanhaBusca: string | null,
): Promise<DesempenhoTrafego> => {
  const [campanhas, metricas, vendas] = await Promise.all([
    listarCampanhas(),
    listarTodos({
      plural: 'metricasTrafego',
      tipoFiltro: 'MetricaTrafegoFilterInput',
      campos: 'data campanhaId origem impressoes cliques visitas leads conversoes gasto { amountMicros }',
      filtro: { and: [{ data: { gte: intervalo.inicio } }, { data: { lte: intervalo.fim } }] },
    }),
    listarTodos({
      plural: 'vendas',
      tipoFiltro: 'VendaFilterInput',
      campos: 'id campanhaId utmCampaign status valor { amountMicros }',
      filtro: {
        and: [
          { status: { in: [STATUS_VENDA_APROVADA] } },
          { campanhaId: { is: 'NOT_NULL' } },
          { createdAt: { gte: `${intervalo.inicio}T00:00:00.000Z` } },
          { createdAt: { lt: `${somarDias(intervalo.fim, 1)}T00:00:00.000Z` } },
        ],
      },
    }),
  ]);

  return montarDesempenhoTrafego({
    campanhas,
    metricas: metricas.map(mapearNoMetrica),
    vendas: vendas.map(mapearNoVenda),
    intervalo,
    campanhaBusca,
  });
};
