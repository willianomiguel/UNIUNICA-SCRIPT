import { defineLogicFunction } from 'twenty-sdk/define';
import { type RoutePayload } from 'twenty-sdk/logic-function';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { extrairIdPagamentoMercadoPago } from 'src/modules/vendas/utils/extrair-id-pagamento-mercado-pago.util';
import { normalizarPagamentoMercadoPago } from 'src/modules/vendas/utils/normalizar-pagamento-mercado-pago.util';
import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';
import { verificarAssinaturaMercadoPago } from 'src/modules/vendas/utils/verificar-assinatura-mercado-pago.util';
import { buscarPagamentoMercadoPago } from 'src/modules/vendas/vendas-client/buscar-pagamento-mercado-pago';
import { processarEventoPagamento } from 'src/modules/vendas/vendas-client/processar-evento-pagamento';

// The notification only carries a payment id; the payment itself is read from the Mercado Pago API,
// so a forged notification can at most trigger a re-read. The secret signature check is optional.
const handler = async (event: RoutePayload) => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const segredo = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!accessToken) {
    return respostaJson(503, { erro: 'Configure a variável MERCADO_PAGO_ACCESS_TOKEN no app.' });
  }

  const query = event.queryStringParameters ?? {};
  const { idPagamento, tipoEvento } = extrairIdPagamentoMercadoPago(event.body, query);

  if (
    segredo &&
    !verificarAssinaturaMercadoPago({
      cabecalhoAssinatura: event.headers['x-signature'],
      idRequisicao: event.headers['x-request-id'],
      idDado: query['data.id'] ?? idPagamento,
      segredo,
    })
  ) {
    return respostaJson(401, { erro: 'Assinatura Mercado Pago inválida.' });
  }

  if (idPagamento === null) {
    return respostaJson(200, { ok: true, ignorado: true, mensagem: `Notificação "${tipoEvento}" não é de pagamento.` });
  }

  const resultado = await processarEventoPagamento({
    gateway: 'MERCADO_PAGO',
    payload: { notificacao: event.body, query },
    normalizar: async () =>
      normalizarPagamentoMercadoPago(
        await buscarPagamentoMercadoPago(idPagamento, accessToken),
        tipoEvento,
      ),
  });

  return respostaJson(resultado.ok ? 200 : 500, resultado);
};

export default defineLogicFunction({
  universalIdentifier: VENDAS_IDS.logicFunctions.webhookMercadoPago,
  name: 'vendas-webhook-mercado-pago',
  description: 'Recebe notificações de pagamento do Mercado Pago e registra a venda correspondente.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/vendas/webhook/mercado-pago',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: ['x-signature', 'x-request-id'],
  },
});
