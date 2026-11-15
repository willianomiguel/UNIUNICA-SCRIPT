import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';

import { votarIdeias } from 'src/modules/projetos/actions/votar-ideias';
import {
  VOTAR_IDEIAS_LOGIC_FUNCTION_ID,
  VOTAR_IDEIAS_ROUTE_PATH,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';
import { extractBulkBody } from 'src/modules/projetos/utils/extract-bulk-body.util';
import { normalizeBulkRecordsInput } from 'src/modules/projetos/utils/normalize-bulk-records-input.util';

const handler = async (input: unknown): Promise<BulkActionResult> =>
  votarIdeias(new RestApiClient(), normalizeBulkRecordsInput(extractBulkBody(input)));

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
