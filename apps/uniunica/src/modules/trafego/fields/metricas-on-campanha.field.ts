import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ON_METRICA_FIELD_ID,
  METRICA_TRAFEGO_OBJECT_ID,
  METRICAS_ON_CAMPANHA_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineField({
  universalIdentifier: METRICAS_ON_CAMPANHA_FIELD_ID,
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'metricas',
  label: 'Métricas',
  description: 'Números diários da campanha',
  icon: 'IconChartLine',
  relationTargetObjectMetadataUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: CAMPANHA_ON_METRICA_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
