import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

// Variáveis do módulo sprints, no formato de `applicationVariables` do defineApplication.
export default {
  GITHUB_WEBHOOK_SECRET: {
    universalIdentifier: SPRINTS_IDS.applicationVariables.githubWebhookSecret,
    label: 'Segredo do webhook do GitHub',
    description:
      'Mesmo valor do campo "Secret" do webhook em GitHub > Settings > Webhooks. Usado para validar a assinatura X-Hub-Signature-256.',
    isSecret: true,
    isRequired: false,
  },
};
