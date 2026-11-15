import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import type { DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { processarEventoTarefa } from 'src/modules/sprints/services/processar-evento-tarefa.service';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;

// Tarefa criada: gera o código UNI-<n>, grava a conclusão e recalcula a sprint
const handler = async (evento: DatabaseEventPayload) =>
  processarEventoTarefa(
    evento as unknown as Parameters<typeof processarEventoTarefa>[0],
    'created',
  );

export default defineLogicFunction({
  universalIdentifier: SPRINTS_IDS.logicFunctions.tarefaCriada,
  name: 'sprints-tarefa-criada',
  description: 'Tarefa criada: gera o código UNI-<n>, grava a conclusão e recalcula a sprint',
  timeoutSeconds: 30,
  handler,
  eventTriggerSettings: {
    on: 'recordEvent',
    objectUniversalIdentifier: TASK.universalIdentifier,
    action: 'created',
  },
});
