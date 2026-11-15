import {
  AggregateOperations,
  defineView,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_TODOS,
  name: 'Todos',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: [
    {
      universalIdentifier: '01fa637e-b442-4ceb-a103-7bfd7146a47a',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '6458bafa-cfa3-4664-87d2-8279ab4df124',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      position: 1,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: 'c571eb0c-8098-41d1-b70b-7b3ca8690525',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 2,
      isVisible: true,
      size: 140,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: 'b57e743e-42d7-4d20-9f87-83a6439d35ef',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '07fb9c6e-f1d5-462b-9b59-ea3f228a9ca4',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '841879b7-ad5a-40dd-922c-66e237c89460',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '1a81444c-f7f0-4232-80df-956fed7c7b14',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 6,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: '5d4c927e-dbaa-4704-9269-6db87f6ca0cd',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CENTRO_CUSTO,
      position: 7,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '75f1817a-be59-4729-88d3-91d92c9115b9',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_FORMA_PAGAMENTO,
      position: 8,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '6c16f379-3e29-479b-8706-ea1e67749143',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_RECORRENCIA,
      position: 9,
      isVisible: true,
      size: 130,
    },
    {
      universalIdentifier: '02d282a7-2848-41c6-bd62-841011eaf216',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_ORIGEM,
      position: 10,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '9b5593a0-5ebb-4b1e-b177-6de5cc5d765a',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENDA,
      position: 11,
      isVisible: true,
      size: 170,
    },
  ],
  sorts: [
    {
      universalIdentifier: 'c5b4014e-34b7-4089-9fd9-82a6ff11fcfa',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      direction: ViewSortDirection.DESC,
    },
  ],
});
