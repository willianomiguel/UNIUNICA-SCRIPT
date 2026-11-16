import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineField({
  universalIdentifier: VENDAS_IDS.eventoPagamento.venda,
  objectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  type: FieldType.RELATION,
  name: 'venda',
  label: 'Venda',
  icon: 'IconReceipt2',
  relationTargetObjectMetadataUniversalIdentifier: VENDAS_IDS.objetoVenda,
  relationTargetFieldMetadataUniversalIdentifier: VENDAS_IDS.venda.eventos,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'vendaId',
  },
});
