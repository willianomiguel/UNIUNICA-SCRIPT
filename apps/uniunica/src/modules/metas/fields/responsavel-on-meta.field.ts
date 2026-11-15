import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: METAS_IDS.META_RESPONSAVEL,
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: FieldType.RELATION,
  name: 'responsavel',
  label: 'Responsável',
  icon: 'IconUserCircle',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: METAS_IDS.WORKSPACE_MEMBER_METAS,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'responsavelId',
  },
});
