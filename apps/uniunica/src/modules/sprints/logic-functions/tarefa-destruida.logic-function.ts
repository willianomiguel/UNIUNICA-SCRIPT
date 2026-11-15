import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import type { DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { processarEventoTarefa } from 'src/modules/sprints/services/processar-evento-tarefa.service';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;

// Tarefa excluída permanentemente: recalcula os pontos da sprint
const handler = async (evento: DatabaseEventPayload) => {
  try {
    return await processarEventoTarefa(
      evento as unknown as Parameters<typeof processarEventoTarefa>[0],
      'destroyed',
    );
  } catch (erro) {
    console.error('[sprints] falha ao processar evento de tarefa', erro);
    throw erro;
  }
};

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.tarefaDestruida,
  name: 'sprints-tarefa-destruida',
  description: 'Tarefa excluída permanentemente: recalcula os pontos da sprint',
  timeoutSeconds: 30,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: TASK.universalIdentifier,
    action: 'destroyed',
  },
});
