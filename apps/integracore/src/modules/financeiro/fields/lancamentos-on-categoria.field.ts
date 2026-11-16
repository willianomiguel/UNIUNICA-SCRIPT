import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: FINANCEIRO_IDS.CATEGORIA_LANCAMENTOS,
  objectUniversalIdentifier: OBJECTS.categoriaFinanceira.universalIdentifier,
  type: FieldType.RELATION,
  name: 'lancamentos',
  label: 'Lançamentos',
  icon: 'IconCash',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECTS.lancamento.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
