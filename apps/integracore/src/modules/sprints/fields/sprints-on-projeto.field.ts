import {
  defineField,
  FieldType,
  RelationType,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.projetoFields.sprints,
  objectUniversalIdentifier: SPRINTS_IDS.objects.projeto,
  type: FieldType.RELATION,
  name: 'sprints',
  label: 'Sprints',
  description: 'Sprints do projeto',
  icon: 'IconRun',
  relationTargetObjectMetadataUniversalIdentifier: SPRINTS_IDS.objects.sprint,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.sprintFields.projeto,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
