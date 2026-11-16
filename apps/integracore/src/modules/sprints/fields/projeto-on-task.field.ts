import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.projeto,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.RELATION,
  name: 'projeto',
  label: 'Projeto',
  description: 'Projeto ao qual a tarefa pertence',
  icon: 'IconBriefcase',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: SPRINTS_IDS.objects.projeto,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.projetoFields.tarefas,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projetoId',
  },
});
