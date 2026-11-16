import { RestApiClient } from 'integra-client-sdk/rest';
import { defineLogicFunction } from 'integra-sdk/define';
import { type DatabaseEventBatchPayload } from 'integra-sdk/logic-function';

import { RECALCULAR_PONTUACAO_IDEIA_LOGIC_FUNCTION_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { extractIdeiasParaPontuar } from 'src/modules/projetos/utils/extract-ideias-para-pontuar.util';

// Recalcula ideia.pontuacao em qualquer criação/alteração de ideia; só grava quando o valor
// muda (o filtro por campos não vale para o curinga 'ideia.*'), o que também evita laços.
const handler = async (batch: DatabaseEventBatchPayload<any>): Promise<void> => {
  const updates = extractIdeiasParaPontuar(batch.events ?? []);

  if (updates.length === 0) {
    return;
  }

  const client = new RestApiClient();

  for (const { id, pontuacao } of updates) {
    try {
      await client.patch(`/rest/ideias/${id}`, { pontuacao });
    } catch (error) {
      console.error('recalcular-pontuacao-ideia: falha ao gravar', id, error);
    }
  }
};

export default defineLogicFunction({
  universalIdentifier: RECALCULAR_PONTUACAO_IDEIA_LOGIC_FUNCTION_ID,
  name: 'recalcular-pontuacao-ideia',
  description: 'Recalcula a pontuação da ideia: impacto × (1 + votos) ÷ esforço',
  timeoutSeconds: 30,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'ideia.*',
    batchMode: true,
  },
});
