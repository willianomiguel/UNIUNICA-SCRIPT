import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  TRANSFORMAR_IDEIAS_LOGIC_FUNCTION_ID,
  TRANSFORMAR_IDEIAS_ROUTE_PATH,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { type IdeiaRecord } from 'src/modules/projetos/types/ideia-record';
import { buildProjetoFromIdeia } from 'src/modules/projetos/utils/build-projeto-from-ideia.util';
import { extractBulkBody } from 'src/modules/projetos/utils/extract-bulk-body.util';
import { normalizeBulkRecordsInput } from 'src/modules/projetos/utils/normalize-bulk-records-input.util';
import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

// "Transformar em projeto": cria um projeto a partir de cada ideia, liga a ideia ao
// projeto e marca a ideia como VIROU_PROJETO. Ideias já ligadas a um projeto são ignoradas.
const handler = async (input: unknown): Promise<BulkActionResult> => {
  const ids = normalizeBulkRecordsInput(extractBulkBody(input));
  const client = new RestApiClient();
  const results: BulkActionResult['results'] = [];
  const todayMs = Date.now();

  for (const id of ids) {
    try {
      const response = await client.get<{ data?: { ideia?: IdeiaRecord } }>(`/rest/ideias/${id}`);
      const ideia = response?.data?.ideia;

      if (!ideia) {
        results.push({ id, status: 'FAILED', message: 'Ideia não encontrada' });
        continue;
      }

      if (ideia.projetoId) {
        results.push({
          id,
          status: 'SKIPPED',
          projetoId: ideia.projetoId,
          message: `"${ideia.titulo ?? 'Ideia'}" já virou projeto`,
        });
        continue;
      }

      const created = await client.post<{ data?: { createProjeto?: { id: string } } }>(
        '/rest/projetos',
        buildProjetoFromIdeia(ideia, todayMs),
      );
      const projetoId = created?.data?.createProjeto?.id;

      if (!projetoId) {
        results.push({ id, status: 'FAILED', message: 'O projeto não foi criado' });
        continue;
      }

      await client.patch(`/rest/ideias/${id}`, { projetoId, status: 'VIROU_PROJETO' });
      results.push({ id, status: 'SUCCESS', projetoId });
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
  universalIdentifier: TRANSFORMAR_IDEIAS_LOGIC_FUNCTION_ID,
  name: 'transformar-ideias-em-projeto',
  description:
    'Cria um projeto para cada ideia recebida em { records: [{ id }] }, liga os dois e marca a ideia como "Virou projeto"',
  timeoutSeconds: 60,
  handler,
  httpRouteTriggerSettings: {
    path: TRANSFORMAR_IDEIAS_ROUTE_PATH,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
