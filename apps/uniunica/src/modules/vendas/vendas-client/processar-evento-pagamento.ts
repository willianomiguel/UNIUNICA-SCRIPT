import { CoreApiClient } from 'twenty-client-sdk/core';

import { type GatewayPagamento } from 'src/modules/vendas/types/gateway-pagamento';
import { type ResultadoNormalizacao } from 'src/modules/vendas/types/resultado-normalizacao';
import { type ResultadoProcessamento } from 'src/modules/vendas/types/resultado-processamento';
import { mensagemDeErro } from 'src/modules/vendas/utils/mensagem-de-erro.util';
import { gravarVenda } from 'src/modules/vendas/vendas-client/gravar-venda';

// Logs the raw webhook as an eventoPagamento, then upserts the sale it describes.
export const processarEventoPagamento = async ({
  gateway,
  payload,
  normalizar,
}: {
  gateway: GatewayPagamento;
  payload: unknown;
  normalizar: () => ResultadoNormalizacao | Promise<ResultadoNormalizacao>;
}): Promise<ResultadoProcessamento> => {
  const client = new CoreApiClient();
  const recebidoEm = new Date().toISOString();
  let resultado: ResultadoNormalizacao;

  try {
    resultado = await normalizar();
  } catch (erro) {
    resultado = {
      tipo: 'IGNORADO',
      tipoEvento: 'erro_normalizacao',
      idExterno: null,
      motivo: mensagemDeErro(erro),
    };
  }

  const idExterno =
    resultado.tipo === 'VENDA' ? resultado.venda.idExterno : resultado.idExterno;
  const { createEventoPagamento } = await client.mutation({
    createEventoPagamento: {
      __args: {
        data: {
          tipo: resultado.tipoEvento,
          gateway,
          idExterno: idExterno ?? undefined,
          payload: (payload ?? {}) as object,
          recebidoEm,
          processado: false,
          erro: resultado.tipo === 'IGNORADO' ? resultado.motivo : undefined,
        },
      },
      id: true,
    },
  });
  if (!createEventoPagamento) {
    throw new Error('O Twenty não retornou o evento de pagamento criado');
  }

  const eventoId = createEventoPagamento.id;

  if (resultado.tipo === 'IGNORADO') {
    return {
      ok: true,
      eventoId,
      vendaId: null,
      status: null,
      criada: false,
      ignorado: true,
      mensagem: resultado.motivo,
    };
  }

  try {
    const venda = await gravarVenda({ client, venda: resultado.venda, recebidoEm });

    await client.mutation({
      updateEventoPagamento: {
        __args: { id: eventoId, data: { processado: true, vendaId: venda.id } },
        id: true,
      },
    });

    return {
      ok: true,
      eventoId,
      vendaId: venda.id,
      status: venda.status,
      criada: venda.criada,
      ignorado: false,
      mensagem: null,
    };
  } catch (erro) {
    const mensagem = mensagemDeErro(erro);

    await client.mutation({
      updateEventoPagamento: {
        __args: { id: eventoId, data: { erro: mensagem } },
        id: true,
      },
    });

    return {
      ok: false,
      eventoId,
      vendaId: null,
      status: null,
      criada: false,
      ignorado: false,
      mensagem,
    };
  }
};
