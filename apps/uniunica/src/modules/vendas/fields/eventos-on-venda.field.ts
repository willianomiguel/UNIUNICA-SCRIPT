import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineField({
  universalIdentifier: VENDAS_IDS.venda.eventos,
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: FieldType.RELATION,
  name: 'eventos',
  label: 'Eventos de pagamento',
  icon: 'IconWebhook',
  relationTargetObjectMetadataUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  relationTargetFieldMetadataUniversalIdentifier: VENDAS_IDS.eventoPagamento.venda,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
