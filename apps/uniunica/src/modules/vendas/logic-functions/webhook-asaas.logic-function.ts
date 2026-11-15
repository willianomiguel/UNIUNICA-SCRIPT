import { defineLogicFunction } from 'twenty-sdk/define';
import { type RoutePayload } from 'twenty-sdk/logic-function';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { compararSegredo } from 'src/modules/vendas/utils/comparar-segredo.util';
import { normalizarEventoAsaas } from 'src/modules/vendas/utils/normalizar-evento-asaas.util';
import { respostaJson } from 'src/modules/vendas/utils/resposta-json.util';
import { processarEventoPagamento } from 'src/modules/vendas/vendas-client/processar-evento-pagamento';

const handler = async (event: RoutePayload) => {
  const token = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!token) {
    return respostaJson(503, { erro: 'Configure a variável ASAAS_WEBHOOK_TOKEN no app.' });
  }

  if (!compararSegredo(event.headers['asaas-access-token'], token)) {
    return respostaJson(401, { erro: 'Token de autenticação Asaas inválido.' });
  }

  const resultado = await processarEventoPagamento({
    gateway: 'ASAAS',
    payload: event.body,
    normalizar: () => normalizarEventoAsaas(event.body),
  });

  return respostaJson(resultado.ok ? 200 : 500, resultado);
};

export default defineLogicFunction({
  universalIdentifier: VENDAS_IDS.logicFunctions.webhookAsaas,
  name: 'vendas-webhook-asaas',
  description: 'Recebe webhooks de cobranças do Asaas e registra a venda correspondente.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: '/vendas/webhook/asaas',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: ['asaas-access-token'],
  },
});
