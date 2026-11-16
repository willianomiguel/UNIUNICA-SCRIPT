import { type RestApiClient } from 'integra-client-sdk/rest';

import { fetchRestRecords } from 'src/modules/avisos/data/fetch-rest-records';
import { type AlertaMetrica } from 'src/modules/avisos/types/alerta-metrica';
import { computeMetricValue } from 'src/modules/avisos/utils/compute-metric-value.util';
import { getMetricQuery } from 'src/modules/avisos/utils/get-metric-query.util';
import { getMetricWindow } from 'src/modules/avisos/utils/get-metric-window.util';
import { getRestObjectName } from 'src/modules/avisos/utils/get-rest-object-name.util';
import { toErrorMessage } from 'src/modules/avisos/utils/to-error-message.util';

export const computeAlertaMetric = async (
  client: RestApiClient,
  metrica: AlertaMetrica,
  janelaDias: number,
  now: Date,
): Promise<number> => {
  const window = getMetricWindow(now, janelaDias);
  const query = getMetricQuery(metrica, window);

  try {
    const records = await fetchRestRecords(client, query.path, query.filter);

    return computeMetricValue(metrica, records, window);
  } catch (error) {
    throw new Error(
      `Não foi possível ler "${getRestObjectName(query.path)}" para calcular a métrica (o módulo existe?): ${toErrorMessage(error)}`,
    );
  }
};
