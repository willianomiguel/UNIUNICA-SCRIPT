import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

export default defineView({
  universalIdentifier: 'cd5b9719-9c19-48a1-aa6f-bd72b2720beb',
  name: 'Recusas e falhas',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.TABLE,
  icon: 'IconCreditCardOff',
  position: 3,
  fields: [
    { universalIdentifier: '075c7826-f4f4-4c01-bced-b0e67447c6c6', fieldMetadataUniversalIdentifier: F.descricao, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: '476b26bd-6e47-4682-86d5-865b776ffffb', fieldMetadataUniversalIdentifier: F.dataEvento, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: 'a04f0c25-91c9-4d28-b224-24a554ac38bc', fieldMetadataUniversalIdentifier: F.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'cd57d9b2-dc14-4084-9aa0-cf50d46d468f', fieldMetadataUniversalIdentifier: F.valor, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: '0cf578fe-b7d3-46c7-be93-290553626a3f', fieldMetadataUniversalIdentifier: F.motivoRecusa, position: 4, isVisible: true, size: 240 },
    { universalIdentifier: 'f20848cc-4f04-4638-90eb-d17cb953c3b7', fieldMetadataUniversalIdentifier: F.clienteNome, position: 5, isVisible: true, size: 180 },
    { universalIdentifier: 'a2c8874f-45b4-400a-b04e-f129e0044c3a', fieldMetadataUniversalIdentifier: F.clienteEmail, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: '5aee62a6-e62d-413c-879a-81a8de3565e0', fieldMetadataUniversalIdentifier: F.metodoPagamento, position: 7, isVisible: true, size: 150 },
    { universalIdentifier: 'b7586f51-aeea-4d9f-bdea-70b6e31924b3', fieldMetadataUniversalIdentifier: F.gateway, position: 8, isVisible: true, size: 130 },
    { universalIdentifier: 'dd3ec283-79de-40db-82bd-3de06797295f', fieldMetadataUniversalIdentifier: F.idExterno, position: 9, isVisible: true, size: 180 },
  ],
  filters: [
    {
      universalIdentifier: '70429d06-74e8-435d-a22f-1bd22304cc82',
      fieldMetadataUniversalIdentifier: F.status,
      operand: ViewFilterOperand.IS,
      value: ['RECUSADA', 'FALHA'],
    },
  ],
  sorts: [
    { universalIdentifier: 'cdd7ee65-470d-4d00-a8ff-a0d9d5cafc4c', fieldMetadataUniversalIdentifier: F.dataEvento, direction: ViewSortDirection.DESC },
  ],
});
