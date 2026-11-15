import { RestApiClient } from 'twenty-client-sdk/rest';

import { AVISOS_SEED_ALERTAS } from 'src/modules/avisos/constants/avisos-seed-alertas';
import { fetchRestRecords } from 'src/modules/avisos/data/fetch-rest-records';
import { selectMissingAlertaSeeds } from 'src/modules/avisos/utils/select-missing-alerta-seeds.util';

// Idempotente: cria as regras de exemplo que ainda não existem (sempre inativas e sem destino).
const seedAvisos = async (): Promise<void> => {
  const client = new RestApiClient();
  const existing = await fetchRestRecords(client, '/rest/alertas');
  const missing = selectMissingAlertaSeeds(
    AVISOS_SEED_ALERTAS,
    existing.map((record) => (typeof record.nome === 'string' ? record.nome : '')),
  );

  for (const seed of missing) {
    await client.post('/rest/alertas', { ...seed, ativo: false, destino: null });
  }
};

export default seedAvisos;
