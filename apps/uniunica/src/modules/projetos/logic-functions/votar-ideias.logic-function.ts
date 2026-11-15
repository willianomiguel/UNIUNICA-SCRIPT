import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  VOTAR_IDEIAS_LOGIC_FUNCTION_ID,
  VOTAR_IDEIAS_ROUTE_PATH,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { type IdeiaRecord } from 'src/modules/projetos/types/ideia-record';
import { extractBulkBody } from 'src/modules/projetos/utils/extract-bulk-body.util';
import { normalizeBulkRecordsInput } from 'src/modules/projetos/utils/normalize-bulk-records-input.util';
import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

// "Votar": soma 1 voto em cada ideia selecionada. A pontuação é recalculada pela
// função de evento recalcular-pontuacao-ideia.
const handler = async (input: unknown): Promise<BulkActionResult> => {
  const ids = normalizeBulkRecordsInput(extractBulkBody(input));
  const client = new RestApiClient();
  const results: BulkActionResult['results'] = [];

  for (const id of ids) {
    try {
      const response = await client.get<{ data?: { ideia?: IdeiaRecord } }>(`/rest/ideias/${id}`);
      const ideia = response?.data?.ideia;

      if (!ideia) {
        results.push({ id, status: 'FAILED', message: 'Ideia não encontrada' });
        continue;
      }

      await client.patch(`/rest/ideias/${id}`, { votos: (ideia.votos ?? 0) + 1 });
      results.push({ id, status: 'SUCCESS' });
    } catch (error) {
      results.push({
        id,
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  return summarizeBulkResults(results);
};

export default defineLogicFunction({
  universalIdentifier: VOTAR_IDEIAS_LOGIC_FUNCTION_ID,
  name: 'votar-ideias',
  description: 'Soma 1 voto em cada ideia recebida em { records: [{ id }] }',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: VOTAR_IDEIAS_ROUTE_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
