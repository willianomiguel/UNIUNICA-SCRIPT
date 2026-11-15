import { type RestApiClient } from 'twenty-client-sdk/rest';

import { fetchRestRecords } from 'src/modules/avisos/data/fetch-rest-records';
import { type AlertaRule } from 'src/modules/avisos/types/alerta-rule';
import { parseAlertaRule } from 'src/modules/avisos/utils/parse-alerta-rule.util';

export const fetchAlertaRules = async (
  client: RestApiClient,
  filter?: string,
): Promise<AlertaRule[]> =>
  (await fetchRestRecords(client, '/rest/alertas', filter))
    .map(parseAlertaRule)
    .filter((rule): rule is AlertaRule => rule !== null);
