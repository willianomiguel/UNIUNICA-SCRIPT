import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENDA,
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: FieldType.RELATION,
  name: 'venda',
  label: 'Venda',
  icon: 'IconShoppingCart',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECTS.venda.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    FINANCEIRO_IDS.VENDA_LANCAMENTOS,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'vendaId',
  },
});
