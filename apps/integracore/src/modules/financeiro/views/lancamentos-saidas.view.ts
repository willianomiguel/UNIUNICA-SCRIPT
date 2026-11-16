import {
  AggregateOperations,
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'integra-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineView({
  universalIdentifier: FINANCEIRO_IDS.VIEW_SAIDAS,
  name: 'Saídas',
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconArrowUpRight',
  position: 2,
  fields: [
    {
      universalIdentifier: '054f9785-8e7b-4d8d-988c-bd0efda7221b',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DESCRICAO,
      position: 0,
      isVisible: true,
      size: 240,
    },
    {
      universalIdentifier: '9fb5fd54-9216-47d9-a1bb-badc1eaf41db',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      position: 1,
      isVisible: true,
      size: 110,
    },
    {
      universalIdentifier: '78125624-284d-45d9-8662-f0df97c78179',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VALOR,
      position: 2,
      isVisible: true,
      size: 140,
      aggregateOperation: AggregateOperations.SUM,
    },
    {
      universalIdentifier: 'efc925ff-b3ae-47c6-b440-45ef56539286',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      position: 3,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: 'e0e3b773-05de-46ba-957e-c69bd0c568ab',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENCIMENTO,
      position: 4,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '626aa297-24c9-472e-873f-a6e766214140',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_STATUS,
      position: 5,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '403980a4-4e6f-4198-9692-90177acccc6d',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CATEGORIA,
      position: 6,
      isVisible: true,
      size: 170,
    },
    {
      universalIdentifier: '1d05bce0-d977-4833-8785-727b8cda17f8',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_CENTRO_CUSTO,
      position: 7,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: '87c2e5ce-45ed-43a4-a339-e3886af149f8',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_FORMA_PAGAMENTO,
      position: 8,
      isVisible: true,
      size: 150,
    },
    {
      universalIdentifier: 'd6dc4c50-87ef-46be-ac46-acf3fceb37d6',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_RECORRENCIA,
      position: 9,
      isVisible: true,
      size: 130,
    },
    {
      universalIdentifier: 'fd0593ba-ad9f-4eca-b176-7fb4d84ea686',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_ORIGEM,
      position: 10,
      isVisible: true,
      size: 120,
    },
    {
      universalIdentifier: '788d1dae-1c09-4527-8173-efa0eee31144',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_VENDA,
      position: 11,
      isVisible: true,
      size: 170,
    },
  ],
  filters: [
    {
      universalIdentifier: 'd80533a3-00f5-4904-b761-c6df226c67d3',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_TIPO,
      operand: ViewFilterOperand.IS,
      value: ['SAIDA'],
    },
  ],
  sorts: [
    {
      universalIdentifier: '475a5456-97d8-4601-92ab-c09215141ffc',
      fieldMetadataUniversalIdentifier: FINANCEIRO_IDS.LANCAMENTO_DATA,
      direction: ViewSortDirection.DESC,
    },
  ],
});
