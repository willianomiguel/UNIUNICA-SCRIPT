import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_ENTRADAS,
  name: 'Entradas',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconArrowDownLeft',
  position: 1,
  fields: [
    {
      universalIdentifier: 'b48a5024-3b4d-4822-bfa9-7783c1f40c48',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '582b69b6-def5-440d-b3cc-18912ef85a46',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      position: 1,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: '7a8094ab-722b-4b69-87d6-804db6ea50c3',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 2,
      isVisible: true,
      size: 140,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: 'c6f180eb-98e9-4271-aad1-e75b6359ac9d',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'a0f744b0-1056-48cb-9cb5-c0648e8377d8',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'cbac5d36-8bc6-47eb-a0c3-b2809b0b9c38',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'f29764fe-5944-4d3c-bb9f-1848adfd64d6',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 6,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: '19fd2a09-a7d8-4600-9a79-ddb30ba61576',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CENTRO_CUSTO,
      position: 7,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '39781f3d-9aff-4dc7-b66c-b0f93f33fe9e',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_FORMA_PAGAMENTO,
      position: 8,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: 'c178f6dd-de6a-42e5-874b-f8d294023787',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_RECORRENCIA,
      position: 9,
      isVisible: true,
      size: 130,
    },
    {
      universalIdentifier: '4e1f9310-1aea-4eda-82c7-d963f522dc95',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_ORIGEM,
      position: 10,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'f6d589bc-565e-49dc-ad5f-4152904499ea',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENDA,
      position: 11,
      isVisible: true,
      size: 170,
    },
  ],
  filters: [
    {
      universalIdentifier: '0b5b810f-c2f7-4eb5-ad75-1e80b5994100',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      operand: ViewFilterOperand.IS,
      value: ['ENTRADA'],
    },
  ],
  sorts: [
    {
      universalIdentifier: '6da7fb1d-4154-4ba1-b987-b1fb325865ee',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      direction: ViewSortDirection.DESC,
    },
  ],
});
