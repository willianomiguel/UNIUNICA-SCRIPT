import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;
const T = SPRINTS_IDS.taskFields;

const CAMPOS: Array<[string, string, number]> = [
  ['3a0a299a-2a60-4ab2-afd6-742e9d05d4e0', TASK.fields.title.universalIdentifier, 240],
  ['d6239e51-8ef1-46ab-801b-9ecf7a4cebf3', T.codigo, 100],
  ['74c22d7e-5fd5-46ed-b92d-eac73fe5ed74', TASK.fields.status.universalIdentifier, 130],
  ['da45f7d6-361d-43b8-86f3-34125e0a9640', T.pontos, 90],
  ['5a7a16cb-3f9e-4be7-82bb-658b205191ef', T.tipo, 130],
  ['23e3c4c6-fbb3-4532-9495-a68937a8482e', T.prioridade, 120],
  ['5f8f4738-fb76-45d6-82b3-7d9c4e699ccd', TASK.fields.assignee.universalIdentifier, 150],
];

// Tabela de tarefas usada no widget "Tarefas" da página da sprint.
export default defineView({
  universalIdentifier: SPRINTS_IDS.views.sprintTasksTable,
  name: 'Tarefas da sprint',
  objectUniversalIdentifier: TASK.universalIdentifier,
  type: ViewType.TABLE_WIDGET,
  icon: 'IconCheckbox',
  position: 0,
  fields: CAMPOS.map(([universalIdentifier, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
});
