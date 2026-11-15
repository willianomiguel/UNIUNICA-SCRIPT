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
  ['676af680-42d5-46e9-bc17-d43f74d14b1a', TASK.fields.title.universalIdentifier, 260],
  ['a9908101-5330-4941-8486-ce2766ff0adb', T.codigo, 100],
  ['7597dd25-5395-46f6-9ce0-1afceaee10fc', TASK.fields.status.universalIdentifier, 130],
  ['2d21e895-769c-48a4-bc9f-b7b22ba107aa', T.pontos, 90],
  ['7e595c2b-ce5a-4314-9033-8d33638d8a95', T.tipo, 130],
  ['cd40bdc8-20c2-46b0-8cec-cec02de8d8d1', T.prioridade, 120],
  ['a94842fc-2594-48ef-bcb7-7c7129fa0b80', T.projeto, 160],
  ['8eb45705-17fc-4454-b9d2-755a1654c84e', T.sprint, 150],
  ['01dc5f70-5247-49bf-9bc3-b0f0ea066155', TASK.fields.assignee.universalIdentifier, 150],
];

// Tarefas de desenvolvimento ainda sem sprint (com pontos ou tipo definidos).
export default defineView({
  universalIdentifier: SPRINTS_IDS.views.backlog,
  name: 'Backlog',
  objectUniversalIdentifier: TASK.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconStack2',
  position: 21,
  fields: CAMPOS.map(([universalIdentifier, fieldMetadataUniversalIdentifier, size], position) => ({
    universalIdentifier,
    fieldMetadataUniversalIdentifier,
    position,
    isVisible: true,
    size,
  })),
  filters: [
    {
      universalIdentifier: '89935ce9-0e5a-4eab-b28e-5911a8baec08',
      fieldMetadataUniversalIdentifier: T.sprint,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '5857f951-b310-400e-9062-612d9e1c4a46',
      fieldMetadataUniversalIdentifier: T.tipo,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
});
