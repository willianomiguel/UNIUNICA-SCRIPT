import { CoreApiClient } from 'twenty-client-sdk/core';

import { montarVendasExemplo } from 'src/modules/vendas/utils/montar-vendas-exemplo.util';
import { gravarVenda } from 'src/modules/vendas/vendas-client/gravar-venda';

// Idempotent: only example sales whose fixed idExterno is not stored yet are created.
const seedVendas = async (): Promise<void> => {
  const client = new CoreApiClient();
  const agora = new Date();
  const exemplos = montarVendasExemplo(agora);
  const { vendas } = await client.query({
    vendas: {
      __args: {
        filter: { idExterno: { in: exemplos.map((venda) => venda.idExterno) } },
        first: exemplos.length * 2,
      },
      edges: { node: { idExterno: true } },
    },
  });
  const existentes = new Set(
    (vendas?.edges ?? []).map((edge) => edge.node.idExterno),
  );

  for (const venda of exemplos) {
    if (!existentes.has(venda.idExterno)) {
      await gravarVenda({ client, venda, recebidoEm: agora.toISOString() });
    }
  }
};

export default seedVendas;
