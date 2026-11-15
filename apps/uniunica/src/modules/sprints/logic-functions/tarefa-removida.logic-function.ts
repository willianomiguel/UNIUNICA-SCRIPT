import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import type { DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { processarEventoTarefa } from 'src/modules/sprints/services/processar-evento-tarefa.service';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;

// Tarefa excluída: recalcula os pontos da sprint
const handler = async (evento: DatabaseEventPayload) => {
  try {
    return await processarEventoTarefa(
      evento as unknown as Parameters<typeof processarEventoTarefa>[0],
      'deleted',
    );
  } catch (erro) {
    console.error('[sprints] falha ao processar evento de tarefa', erro);
    throw erro;
  }
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.tarefaRemovida,
  name: 'sprints-tarefa-removida',
  description: 'Tarefa excluída: recalcula os pontos da sprint',
  timeoutSeconds: 30,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: TASK.universalIdentifier,
    action: 'deleted',
  },
});
