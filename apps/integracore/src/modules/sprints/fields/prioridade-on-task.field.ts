import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { TAREFA_PRIORIDADE_OPTIONS } from 'src/modules/sprints/constants/tarefa-prioridade-options';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.prioridade,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.SELECT,
  name: 'prioridade',
  label: 'Prioridade',
  description: 'Prioridade da tarefa',
  icon: 'IconFlag',
  isNullable: true,
  options: TAREFA_PRIORIDADE_OPTIONS,
});
