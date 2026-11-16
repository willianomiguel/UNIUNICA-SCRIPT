import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import {
  CAMPANHA_OBJECT_ID,
  CAMPANHA_ON_VENDA_FIELD_ID,
  VENDA_OBJECT_ID,
  VENDAS_ON_CAMPANHA_FIELD_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineField({
  universalIdentifier: VENDAS_ON_CAMPANHA_FIELD_ID,
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  type: FieldType.RELATION,
  name: 'vendas',
  label: 'Vendas',
  description: 'Vendas atribuídas a esta campanha',
  icon: 'IconShoppingCart',
  relationTargetObjectMetadataUniversalIdentifier: VENDA_OBJECT_ID,
  relationTargetFieldMetadataUniversalIdentifier: CAMPANHA_ON_VENDA_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
