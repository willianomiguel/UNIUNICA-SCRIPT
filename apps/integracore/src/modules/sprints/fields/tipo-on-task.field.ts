import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';
import { TAREFA_TIPO_OPTIONS } from 'src/modules/sprints/constants/tarefa-tipo-options';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.tipo,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.SELECT,
  name: 'tipo',
  label: 'Tipo',
  description: 'Tipo de trabalho',
  icon: 'IconCategory',
  isNullable: true,
  options: TAREFA_TIPO_OPTIONS,
});
