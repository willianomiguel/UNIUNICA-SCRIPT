import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import type { DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { processarEventoTarefa } from 'src/modules/sprints/services/processar-evento-tarefa.service';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;

// Tarefa alterada (status, pontos ou sprint): grava/limpa a conclusão e recalcula as sprints
const handler = async (evento: DatabaseEventPayload) => {
  try {
    return await processarEventoTarefa(
      evento as unknown as Parameters<typeof processarEventoTarefa>[0],
      'updated',
    );
  } catch (erro) {
    console.error('[sprints] falha ao processar evento de tarefa', erro);
    throw erro;
  }
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.tarefaAtualizada,
  name: 'sprints-tarefa-atualizada',
  description: 'Tarefa alterada (status, pontos ou sprint): grava/limpa a conclusão e recalcula as sprints',
  timeoutSeconds: 30,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: TASK.universalIdentifier,
    action: 'updated',
    watchedFieldUniversalIdentifiers: [
      TASK.fields.status.universalIdentifier,
      SPRINTS_IDS.taskFields.pontos,
      SPRINTS_IDS.taskFields.sprint,
    ],
  },
});
