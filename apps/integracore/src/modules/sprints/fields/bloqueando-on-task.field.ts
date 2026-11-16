import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'integra-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineField({
  universalIdentifier: SPRINTS_IDS.taskFields.bloqueando,
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  type: FieldType.RELATION,
  name: 'bloqueando',
  label: 'Bloqueando',
  description: 'Tarefas que dependem desta',
  icon: 'IconLockOpen',
  relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: SPRINTS_IDS.taskFields.bloqueadaPor,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
