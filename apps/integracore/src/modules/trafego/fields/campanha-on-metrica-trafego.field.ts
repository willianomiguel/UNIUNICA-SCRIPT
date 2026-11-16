import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import {
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_TRAFEGO_OBJECT_ID,
  METRICAS_ON_CAMPANHA_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineField({
  universalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID,
  objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'campanha',
  label: 'Campanha',
  description: 'Campanha a que estes números pertencem',
  icon: 'IconSpeakerphone',
  relationTargetObjectMetadataUniversalIdentifier: CAMPANHA_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: METRICAS_ON_CAMPANHA_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'campanhaId',
  },
});
