import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.sprintFields.projeto,
  objectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  type: FieldType.RELATION,
  name: 'projeto',
  label: 'Projeto',
  description: 'Projeto da sprint',
  icon: 'IconBriefcase',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: SPRINTS_IDS.objects.projeto,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.projetoFields.sprints,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'projetoId',
  },
});
