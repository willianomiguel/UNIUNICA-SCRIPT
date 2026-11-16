import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.codigo,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.TEXT,
  name: 'codigo',
  label: 'Código',
  description: 'Código curto da tarefa (ex.: UNI-42), gerado automaticamente',
  icon: 'IconHash',
  isNullable: true,
});
