import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { RECALCULAR_PROGRESSO_PROJETO_LOGIC_FUNCTION_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';
import { calcularProgressoProjeto } from 'src/modules/projetos/utils/calcular-progresso-projeto.util';
import { extractProjetoIdsFromTaskEvents } from 'src/modules/projetos/utils/extract-projeto-ids-from-task-events.util';
import { fetchAllRestRecords } from 'src/modules/projetos/utils/fetch-all-rest-records.util';

type TaskRow = { id: string; status?: string | null };

// Recalcula projeto.progresso = tarefas DONE ÷ total, quando uma tarefa ligada a um
// projeto (campo Task.projeto, criado pelo módulo sprints) é criada, excluída, ou muda de
// status/projeto. Sem esse campo os eventos não trazem projetoId e nada acontece.
const handler = async (batch: DatabaseEventBatchPayload<any>): Promise<void> => {
  const projetoIds = extractProjetoIdsFromTaskEvents(batch.name ?? '', batch.events ?? []);

  if (projetoIds.length === 0) {
    return;
  }

  const client = new RestApiClient();

  for (const projetoId of projetoIds) {
    try {
      const tasks = await fetchAllRestRecords<TaskRow>(client, 'tasks', {
        filter: `projetoId[eq]:"${projetoId}"`,
      });
      const progresso = calcularProgressoProjeto(tasks.map((task) => task.status));

      if (progresso !== null) {
        await client.patch(`/rest/projetos/${projetoId}`, { progresso });
      }
    } catch (error) {
      console.error('recalcular-progresso-projeto: falha no projeto', projetoId, error);
    }
  }
};

export default defineLogicFunction({
  universalIdentifier: RECALCULAR_PROGRESSO_PROJETO_LOGIC_FUNCTION_ID,
  name: 'recalcular-progresso-projeto',
  description: 'Recalcula o progresso do projeto pelas tarefas concluídas (DONE ÷ total)',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'task.*',
    batchMode: true,
  },
});
