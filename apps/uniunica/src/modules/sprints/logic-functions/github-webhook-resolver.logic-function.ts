import { defineLogicFunction } from 'twenty-sdk/define';
import {
  type LogicFunctionExecutionContext,
  Response,
  type RoutePayload,
} from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { interpretarEventoGithub } from 'src/modules/sprints/utils/interpretar-evento-github.util';
import { verificarAssinaturaGithub } from 'src/modules/sprints/utils/verificar-assinatura-github.util';

// Rota pública que recebe os webhooks do GitHub (pull_request e push).
// Confere a assinatura X-Hub-Signature-256 com GITHUB_WEBHOOK_SECRET antes de
// qualquer efeito e enfileira o processamento no workspace dono do app.
const handler = async (
  evento: RoutePayload,
  contexto: LogicFunctionExecutionContext,
) => {
  const segredo = process.env.GITHUB_WEBHOOK_SECRET;

  if (!segredo) {
    return new Response(
      { erro: 'GITHUB_WEBHOOK_SECRET não está configurado no app' },
      { status: 503 },
    );
  }

  const assinaturaValida = verificarAssinaturaGithub({
    corpoBruto: evento.rawBody,
    assinatura: evento.headers['x-hub-signature-256'],
    segredo,
  });

  if (!assinaturaValida) {
    return new Response({ erro: 'Assinatura inválida' }, { status: 401 });
  }

  const nomeEvento = evento.headers['x-github-event'];

  if (nomeEvento === 'ping') {
    return new Response({ ok: true, mensagem: 'pong' });
  }

  const interpretado = interpretarEventoGithub(nomeEvento, evento.body);

  if (!interpretado || interpretado.codigos.length === 0) {
    return new Response({ ok: true, ignorado: true, evento: nomeEvento });
  }

  return {
    workspaceId: contexto.workspaceId,
    targetLogicFunctionUniversalIdentifier:
      SPRINTS_IDS.logicFunctions.githubWebhookProcessar,
    payload: {
      evento: interpretado,
      entrega: evento.headers['x-github-delivery'] ?? null,
    },
  };
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.githubWebhookResolver,
  name: 'sprints-github-webhook',
  description:
    'Recebe webhooks do GitHub, valida a assinatura e enfileira a atualização das tarefas',
  timeoutSeconds: 10,
  handler,
  serverRouteTriggerSettings: {
    forwardedRequestHeaders: [
      'x-hub-signature-256',
      'x-github-event',
      'x-github-delivery',
    ],
  },
});
