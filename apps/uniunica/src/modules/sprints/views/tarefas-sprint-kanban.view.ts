import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const TASK = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;
const T = SPRINTS_IDS.taskFields;

const CAMPOS: Array<[string, string, number]> = [
  ['1e514346-2839-4bac-80e9-d3a5bd1064e2', TASK.fields.title.universalIdentifier, 220],
  ['bef20d3c-df27-4446-808b-ea9c16db8392', T.codigo, 100],
  ['957643f9-a35d-4904-83bc-84ae531b9abb', T.pontos, 90],
  ['74d26e13-d482-48cd-94cf-b16e7982e679', T.tipo, 120],
  ['70c4c7a9-834b-4a29-a23d-19282fd1bb8b', T.prioridade, 120],
  ['a5dc7d2f-7b1a-4967-930a-03553435da56', T.sprint, 150],
  ['9f89054c-6c6b-4da0-ab92-89bda79b3833', TASK.fields.assignee.universalIdentifier, 150],
];

const GRUPOS: Array<[string, string]> = [
  ['206d71c0-3b8c-447d-b2bd-36931c6fe4fd', 'TODO'],
  ['bd90a638-6136-4f53-8a43-e19f8a3c0d25', 'IN_PROGRESS'],
  ['a6d94fd7-d0e7-48ca-949c-f28da634c973', 'DONE'],
];

// Quadro Kanban das tarefas que estão em alguma sprint, por status.
export default defineView({
  universalIdentifier: SPRINTS_IDS.views.tarefasSprintKanban,
  name: 'Tarefas em sprint',
  objectUniversalIdentifier: TASK.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 20,
  mainGroupByFieldMetadataUniversalIdentifier: TASK.fields.status.universalIdentifier,
  fields: CAMPOS.map(([universalIdentifier, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  groups: GRUPOS.map(([universalIdentifier, fieldValue], position) => ({
    universalIdentifier,
    fieldValue,
    position,
    isVisible: true,
  })),
  filters: [
    {
      universalIdentifier: '14a0f894-7343-411b-9e9d-725f699155c4',
      fieldMetadataUniversalIdentifier: T.sprint,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
});
