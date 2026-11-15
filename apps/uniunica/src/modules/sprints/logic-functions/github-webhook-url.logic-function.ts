import { defineLogicFunction } from 'twenty-sdk/define';
import { getServerRouteUrl } from 'twenty-sdk/utils';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

// Devolve a URL a cadastrar em GitHub > Settings > Webhooks.
// Rode com: twenty app exec --name sprints-github-webhook-url
const handler = async () => ({
  url: getServerRouteUrl(SPRINTS_IDS.logicFunctions.githubWebhookResolver),
  contentType: 'application/json',
  eventos: ['pull_request', 'push'],
  segredoConfigurado: Boolean(process.env.GITHUB_WEBHOOK_SECRET),
});

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.githubWebhookUrl,
  name: 'sprints-github-webhook-url',
  description: 'Mostra a URL do webhook do GitHub para configurar no repositório',
  timeoutSeconds: 5,
  handler,
  httpRouteTriggerSettings: {
    path: '/sprints/github-webhook-url',
    httpMethod: 'GET',
    isAuthRequired: true,
  },
});
