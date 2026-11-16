import { defineLogicFunction } from 'integra-sdk/define';
import { type RoutePayload } from 'integra-sdk/logic-function';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { normalizarEventoStripe } from 'src/modules/vendas/utils/normalizar-evento-stripe.util';
import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';
import { verificarAssinaturaStripe } from 'src/modules/vendas/utils/verificar-assinatura-stripe.util';
import { processarEventoPagamento } from 'src/modules/vendas/vendas-client/processar-evento-pagamento';

const handler = async (event: RoutePayload) => {
  const segredo = process.env.STRIPE_WEBHOOK_SECRET;

  if (!segredo) {
    return respostaJson(503, { erro: 'Configure a variável STRIPE_WEBHOOK_SECRET no app.' });
  }

  if (event.rawBody === undefined) {
    return respostaJson(400, { erro: 'Corpo bruto indisponível; não é possível validar a assinatura.' });
  }

  const assinaturaValida = verificarAssinaturaStripe({
    corpoBruto: event.rawBody,
    cabecalho: event.headers['stripe-signature'],
    segredo,
    agoraSegundos: Math.floor(Date.now() / 1000),
  });

  if (!assinaturaValida) {
    return respostaJson(401, { erro: 'Assinatura Stripe inválida.' });
  }

  const resultado = await processarEventoPagamento({
    gateway: 'STRIPE',
    payload: event.body,
    normalizar: () => normalizarEventoStripe(event.body),
  });

  return respostaJson(resultado.ok ? 200 : 500, resultado);
};

export default defineLogicFunction({
  universalIdentifier: VENDAS_IDS.logicFunctions.webhookStripe,
  name: 'vendas-webhook-stripe',
  description: 'Recebe webhooks da Stripe e registra a venda correspondente.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/vendas/webhook/stripe',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: ['stripe-signature'],
  },
});
