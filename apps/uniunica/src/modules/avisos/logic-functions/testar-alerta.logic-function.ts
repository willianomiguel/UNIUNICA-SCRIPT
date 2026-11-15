import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';
import { TESTAR_ALERTA_ROUTE_PATH } from 'src/modules/avisos/constants/testar-alerta-route-path';
import { fetchAlertaRules } from 'src/modules/avisos/data/fetch-alerta-rules';
import { testAlerta } from 'src/modules/avisos/data/test-alerta';
import { normalizeTestarAlertaInput } from 'src/modules/avisos/utils/normalize-testar-alerta-input.util';
import { summarizeAlertaResults } from 'src/modules/avisos/utils/summarize-alerta-results.util';

const handler = async (input: unknown) => {
  const ids = normalizeTestarAlertaInput(input);

  if (ids.length === 0) {
    return summarizeAlertaResults([]);
  }

  const client = new RestApiClient();
  const now = new Date();
  const rules = await fetchAlertaRules(client, `id[in]:[${ids.join(',')}]`);
  const results = [];

  for (const rule of rules) {
    results.push(await testAlerta(client, rule, now));
  }

  return summarizeAlertaResults(results);
};

export default defineLogicFunction({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.logicFunctions.testarAlerta,
  name: 'testar-alerta',
  description: 'Envia agora uma mensagem de teste para o canal e destino dos alertas selecionados.',
  timeoutSeconds: 120,
  handler,
  httpRouteTriggerSettings: {
    path: TESTAR_ALERTA_ROUTE_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
