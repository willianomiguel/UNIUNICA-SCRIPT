import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: FieldType.RELATION,
  name: 'categoria',
  label: 'Categoria',
  icon: 'IconCategory',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECTS.categoriaFinanceira.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    FINANCEIRO_IDS.CATEGORIA_LANCAMENTOS,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'categoriaId',
  },
});
