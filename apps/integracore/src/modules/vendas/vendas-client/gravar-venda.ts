import { CoreApiClient } from 'integra-client-sdk/core';

import { type VendaExistente } from 'src/modules/vendas/types/venda-existente';
import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { type VendaStatus } from 'src/modules/vendas/types/venda-status';
import { montarGravacaoVenda } from 'src/modules/vendas/utils/montar-gravacao-venda.util';

// Idempotent upsert keyed by (gateway, idExterno).
export const gravarVenda = async ({
  client,
  venda,
  recebidoEm,
}: {
  client: CoreApiClient;
  venda: VendaNormalizada;
  recebidoEm: string;
}): Promise<{ id: string; status: VendaStatus; criada: boolean }> => {
  const { vendas } = await client.query({
    vendas: {
      __args: {
        filter: {
          gateway: { eq: venda.gateway },
          idExterno: { eq: venda.idExterno },
        },
        first: 1,
      },
      edges: { node: { id: true, status: true, dataEvento: true } },
    },
  });
  const node = vendas?.edges?.[0]?.node;
  const existente: VendaExistente | null = node
    ? {
        id: node.id,
        status: (node.status ?? null) as VendaStatus | null,
        dataEvento: node.dataEvento ?? null,
      }
    : null;
  const gravacao = montarGravacaoVenda({ venda, existente, recebidoEm });

  if (gravacao.operacao === 'CRIAR') {
    const { createVenda } = await client.mutation({
      createVenda: { __args: { data: gravacao.dados }, id: true, status: true },
    });

    if (!createVenda) {
      throw new Error('O IntegraCore não retornou a venda criada');
    }

    return {
      id: createVenda.id,
      status: (createVenda.status ?? venda.status) as VendaStatus,
      criada: true,
    };
  }

  const { updateVenda } = await client.mutation({
    updateVenda: {
      __args: { id: gravacao.id, data: gravacao.dados },
      id: true,
      status: true,
    },
  });

  if (!updateVenda) {
    throw new Error('O IntegraCore não retornou a venda atualizada');
  }

  return {
    id: updateVenda.id,
    status: (updateVenda.status ?? venda.status) as VendaStatus,
    criada: false,
  };
};
