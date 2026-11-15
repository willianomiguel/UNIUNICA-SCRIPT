import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.projetoFields.tarefas,
  objectUniversalIdentifier: SPRINTS_IDS.objects.projeto,
  type: FieldType.RELATION,
  name: 'tarefas',
  label: 'Tarefas',
  description: 'Tarefas do projeto',
  icon: 'IconCheckbox',
  relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.taskFields.projeto,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
