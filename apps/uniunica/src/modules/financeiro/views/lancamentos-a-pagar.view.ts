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
  universalIdentifier: FINANCEIRO_IDS.VIEW_A_PAGAR,
  name: 'A pagar / atrasados',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconAlertTriangle',
  position: 3,
  fields: [
    {
      universalIdentifier: '0769cd02-77f8-4c0e-a02d-f941e44b58c1',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '5d5100a6-1da1-4400-963e-ca4cc75b07dc',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 1,
      isVisible: true,
      size: 140,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: '2462e08e-e53c-4a33-be92-b17f7a489f6f',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 2,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'adcf2010-a48c-4172-a4bf-22293de7dec5',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '0c3b55f7-c911-4892-b925-85a14039dd35',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 4,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: 'd30300a1-e5ab-4298-b873-1458758200c9',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_FORMA_PAGAMENTO,
      position: 5,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '5e6d6cfd-7f4d-4b09-87b3-9be9a1cc4f54',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CENTRO_CUSTO,
      position: 6,
      isVisible: true,
      size: 150,
    },
  ],
  filters: [
    {
      universalIdentifier: '1899fe33-ce51-491e-87d0-17ba6070ee33',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      operand: ViewFilterOperand.IS,
      value: ['SAIDA'],
    },
    {
      universalIdentifier: '4611170a-68f5-4379-82f3-d604664e9231',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      operand: ViewFilterOperand.IS,
      value: ['PENDENTE', 'ATRASADO'],
    },
  ],
  sorts: [
    {
      universalIdentifier: 'bbb2f0c7-f29a-4ef1-8dce-b140274d13b6',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      direction: ViewSortDirection.ASC,
    },
  ],
});
