import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: METAS_IDS.WORKSPACE_MEMBER_METAS,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'metasResponsavel',
  label: 'Metas sob responsabilidade',
  icon: 'IconTarget',
  relationTargetObjectMetadataUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: METAS_IDS.META_RESPONSAVEL,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
