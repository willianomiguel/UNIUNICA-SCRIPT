import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.sprint,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.RELATION,
  name: 'sprint',
  label: 'Sprint',
  description: 'Sprint em que a tarefa será feita (vazio = backlog)',
  icon: 'IconRun',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.sprintFields.tarefas,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'sprintId',
  },
});
