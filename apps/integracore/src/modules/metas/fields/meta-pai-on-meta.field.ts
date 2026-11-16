import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: METAS_IDS.META_PAI,
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  type: FieldType.RELATION,
  name: 'metaPai',
  label: 'Meta principal',
  description: 'Meta (objetivo) à qual esta meta contribui',
  icon: 'IconHierarchy',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier: METAS_IDS.META_SUBMETAS,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'metaPaiId',
  },
});
