import { CoreApiClient } from 'twenty-client-sdk/core';

import { type RegistroVendaApi } from 'src/modules/vendas/types/registro-venda-api';

const TAMANHO_PAGINA = 200;
const MAXIMO_PAGINAS = 25;

// Loads every sale dated from `desde` onwards (capped at 5,000 records), newest first.
export const carregarVendasPainel = async (desde: Date): Promise<RegistroVendaApi[]> => {
  const client = new CoreApiClient();
  const registros: RegistroVendaApi[] = [];
  let cursor: string | undefined;

  for (let pagina = 0; pagina < MAXIMO_PAGINAS; pagina += 1) {
    const { vendas } = await client.query({
      vendas: {
        __args: {
          filter: { dataEvento: { gte: desde.toISOString() } },
          orderBy: [{ dataEvento: 'DescNullsLast' }],
          first: TAMANHO_PAGINA,
          ...(cursor ? { after: cursor } : {}),
        },
        edges: {
          node: {
            id: true,
            descricao: true,
            status: true,
            gateway: true,
            metodoPagamento: true,
            valor: { amountMicros: true, currencyCode: true },
            valorLiquido: { amountMicros: true, currencyCode: true },
            taxaGateway: { amountMicros: true, currencyCode: true },
            dataEvento: true,
            clienteNome: true,
            motivoRecusa: true,
          },
        },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });

    registros.push(...((vendas?.edges ?? []).map((edge) => edge.node) as RegistroVendaApi[]));

    if (!vendas?.pageInfo?.hasNextPage || !vendas.pageInfo.endCursor) {
      break;
    }

    cursor = vendas.pageInfo.endCursor;
  }

  return registros;
};
