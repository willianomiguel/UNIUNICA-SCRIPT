import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: METAS_IDS.META_SUBMETAS,
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: FieldType.RELATION,
  name: 'submetas',
  label: 'Submetas',
  description: 'Resultados-chave que compõem esta meta',
  icon: 'IconSubtask',
  relationTargetObjectMetadataUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: METAS_IDS.META_PAI,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
