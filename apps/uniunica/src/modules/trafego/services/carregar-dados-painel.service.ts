import { STATUS_VENDA_APROVADA } from 'src/modules/trafego/constants/trafego-constantes';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { type DadosPainel } from 'src/modules/trafego/types/dados-painel';
import { type VendaResumo } from 'src/modules/trafego/types/venda-resumo';
import { mapearNoMetrica } from 'src/modules/trafego/utils/mapear-no-metrica.util';
import { mapearNoVenda } from 'src/modules/trafego/utils/mapear-no-venda.util';

// Lê campanhas, métricas a partir de `inicio` e vendas aprovadas (criadas no período) ligadas a campanhas.
export const carregarDadosPainel = async (inicio: string): Promise<DadosPainel> => {
  const [campanhas, metricas] = await Promise.all([
    listarCampanhas(),
    listarTodos({
      plural: 'metricasTrafego',
      tipoFiltro: 'MetricaTrafegoFilterInput',
      campos: 'data campanhaId origem impressoes cliques visitas leads conversoes gasto { amountMicros }',
      filtro: { data: { gte: inicio } },
    }),
  ]);

  let vendas: VendaResumo[] = [];
  let avisoVendas: string | null = null;

  try {
    vendas = (
      await listarTodos({
        plural: 'vendas',
        tipoFiltro: 'VendaFilterInput',
        campos: 'id campanhaId utmCampaign status valor { amountMicros }',
        filtro: {
          status: { in: [STATUS_VENDA_APROVADA] },
          campanhaId: { is: 'NOT_NULL' },
          createdAt: { gte: `${inicio}T00:00:00.000Z` },
        },
      })
    ).map(mapearNoVenda);
  } catch (erro) {
    avisoVendas = `Não foi possível ler as vendas (${erro instanceof Error ? erro.message : String(erro)}). ROAS e CPA usam só os dados das plataformas.`;
  }

  return { campanhas, metricas: metricas.map(mapearNoMetrica), vendas, avisoVendas };
};
