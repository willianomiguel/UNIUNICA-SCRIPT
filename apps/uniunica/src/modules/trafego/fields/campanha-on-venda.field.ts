import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ON_VENDA_FIELD_ID,
  VENDA_OBJECT_ID,
  VENDAS_ON_CAMPANHA_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

// Relação venda.campanha ↔ campanha.vendas — dono: módulo trafego (ver docs/CONTRATO-MODULOS.md).
export default defineField({
  universalIdentifier: CAMPANHA_ON_VENDA_FIELD_ID,
  objectUniversalIdentifier: VENDA_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'campanha',
  label: 'Campanha',
  description: 'Campanha de tráfego que gerou a venda (preenchida automaticamente pelo utm_campaign)',
  icon: 'IconSpeakerphone',
  relationTargetObjectMetadataUniversalIdentifier: CAMPANHA_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: VENDAS_ON_CAMPANHA_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'campanhaId',
  },
});
