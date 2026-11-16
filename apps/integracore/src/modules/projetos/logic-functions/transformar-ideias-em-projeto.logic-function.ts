import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';

import { transformarIdeiasEmProjeto } from 'src/modules/projetos/actions/transformar-ideias-em-projeto';
import {
  TRANSFORMAR_IDEIAS_LOGIC_FUNCTION_ID,
  TRANSFORMAR_IDEIAS_ROUTE_PATH,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { extractBulkBody } from 'src/modules/projetos/utils/extract-bulk-body.util';
import { normalizeBulkRecordsInput } from 'src/modules/projetos/utils/normalize-bulk-records-input.util';

const handler = async (input: unknown): Promise<BulkActionResult> =>
  transformarIdeiasEmProjeto(
    new RestApiClient(),
    normalizeBulkRecordsInput(extractBulkBody(input)),
    Date.now(),
  );

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
