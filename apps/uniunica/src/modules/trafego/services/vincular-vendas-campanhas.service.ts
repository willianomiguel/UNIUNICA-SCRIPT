import { executarGraphql } from 'src/modules/trafego/services/executar-graphql.service';
import { listarCampanhas } from 'src/modules/trafego/services/listar-campanhas.service';
import { listarTodos } from 'src/modules/trafego/services/listar-todos.service';
import { dividirEmLotes } from 'src/modules/trafego/utils/dividir-em-lotes.util';
import { planejarVinculosVendas } from 'src/modules/trafego/utils/planejar-vinculos-vendas.util';

// Preenche venda.campanha pelo utm_campaign quando está vazia. `ids` limita a algumas vendas.
export const vincularVendasCampanhas = async (
  ids?: string[],
): Promise<{ verificadas: number; vinculadas: number }> => {
  if (ids && ids.length === 0) {
    return { verificadas: 0, vinculadas: 0 };
  }

  const vendas = await listarTodos({
    plural: 'vendas',
    tipoFiltro: 'VendaFilterInput',
    campos: 'id utmCampaign campanhaId',
    filtro: {
      campanhaId: { is: 'NULL' },
      utmCampaign: { is: 'NOT_NULL' },
      ...(ids ? { id: { in: ids } } : {}),
    },
  });

  if (vendas.length === 0) {
    return { verificadas: 0, vinculadas: 0 };
  }

  const vinculos = planejarVinculosVendas(
    vendas.map((venda) => ({
      id: venda.id,
      campanhaId: venda.campanhaId ?? null,
      utmCampaign: venda.utmCampaign ?? null,
    })),
    await listarCampanhas(),
  );

  for (const lote of dividirEmLotes(vinculos, 10)) {
    await Promise.all(
      lote.map((vinculo) =>
        executarGraphql(
          `mutation Vincular($id: UUID!, $data: VendaUpdateInput!) {
            updateVenda(id: $id, data: $data) { id }
          }`,
          { id: vinculo.vendaId, data: { campanhaId: vinculo.campanhaId } },
        ),
      ),
    );
  }

  return { verificadas: vendas.length, vinculadas: vinculos.length };
};
