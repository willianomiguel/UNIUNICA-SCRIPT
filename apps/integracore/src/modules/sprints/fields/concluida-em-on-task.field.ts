import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.concluidaEm,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'concluidaEm',
  label: 'Concluída em',
  description: 'Preenchido automaticamente quando a tarefa vai para Concluída',
  icon: 'IconCalendarCheck',
  isNullable: true,
});
