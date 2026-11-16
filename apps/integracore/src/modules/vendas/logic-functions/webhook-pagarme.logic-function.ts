import { defineLogicFunction } from 'integra-sdk/define';
import { type RoutePayload } from 'integra-sdk/logic-function';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { compararSegredo } from 'src/modules/vendas/utils/comparar-segredo.util';
import { normalizarEventoPagarme } from 'src/modules/vendas/utils/normalizar-evento-pagarme.util';
import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';
import { processarEventoPagamento } from 'src/modules/vendas/vendas-client/processar-evento-pagamento';

const handler = async (event: RoutePayload) => {
  const token = process.env.PAGARME_WEBHOOK_TOKEN;

  if (!token) {
    return respostaJson(503, { erro: 'Configure a variável PAGARME_WEBHOOK_TOKEN no app.' });
  }

  // IntegraCore does not forward the Authorization header to routes, so the secret travels as ?token=.
  if (!compararSegredo(event.queryStringParameters?.token, token)) {
    return respostaJson(401, { erro: 'Token do webhook Pagar.me inválido.' });
  }

  const resultado = await processarEventoPagamento({
    gateway: 'PAGARME',
    payload: event.body,
    normalizar: () => normalizarEventoPagarme(event.body),
  });

  return respostaJson(resultado.ok ? 200 : 500, resultado);
};

export default defineLogicFunction({
  universalIdentifier: VENDAS_IDS.logicFunctions.webhookPagarme,
  name: 'vendas-webhook-pagarme',
  description: 'Recebe webhooks de cobranças do Pagar.me (API v5) e registra a venda correspondente.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/vendas/webhook/pagarme',
    httpMethod: 'POST',
    isAuthRequired: false,
  },
});
