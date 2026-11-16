import { defineField, FieldType, RelationType } from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineField({
  universalIdentifier: FINANCEIRO_IDS.VENDA_LANCAMENTOS,
  objectUniversalIdentifier: OBJECTS.venda.universalIdentifier,
  type: FieldType.RELATION,
  name: 'lancamentos',
  label: 'Lançamentos',
  description: 'Lançamentos financeiros gerados por esta venda',
  icon: 'IconCash',
  relationTargetObjectMetadataUniversalIdentifier:
    OBJECTS.lancamento.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    FINANCEIRO_IDS.LANCAMENTO_VENDA,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
