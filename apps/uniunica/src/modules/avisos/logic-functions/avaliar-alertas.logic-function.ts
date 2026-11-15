import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';
import { evaluateAlerta } from 'src/modules/avisos/data/evaluate-alerta';
import { fetchAlertaRules } from 'src/modules/avisos/data/fetch-alerta-rules';
import { summarizeAlertaResults } from 'src/modules/avisos/utils/summarize-alerta-results.util';

const handler = async () => {
  const client = new RestApiClient();
  const now = new Date();
  const rules = await fetchAlertaRules(client, 'ativo[eq]:true');
  const results = [];

  // Sequencial para não estourar limites dos webhooks nem da API.
  for (const rule of rules) {
    results.push(await evaluateAlerta(client, rule, now));
  }

  return summarizeAlertaResults(results);
};

export default defineLogicFunction({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.logicFunctions.avaliarAlertas,
  name: 'avaliar-alertas',
  description: 'A cada 15 minutos avalia as regras de alerta ativas e envia avisos quando o limite é ultrapassado.',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    pattern: '*/15 * * * *',
  },
});
