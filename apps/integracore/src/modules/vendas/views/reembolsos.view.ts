import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

export default defineView({
  universalIdentifier: '118b1ea1-adbb-4ea2-8d9c-3bee29789c21',
  name: 'Reembolsos',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.TABLE,
  icon: 'IconReceiptRefund',
  position: 4,
  fields: [
    { universalIdentifier: 'c744b43b-4adc-4543-92ae-96e1d07eb9ea', fieldMetadataUniversalIdentifier: F.descricao, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: 'c222e0b3-70e9-466c-8e7b-15aa6bcb349e', fieldMetadataUniversalIdentifier: F.dataEvento, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '7e0d8f7e-eb92-44ab-868c-3c32bcfd5c21', fieldMetadataUniversalIdentifier: F.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: '5d030068-6451-49f2-8d2e-868020587e33', fieldMetadataUniversalIdentifier: F.valor, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: '1adece8a-164a-4f36-aeca-06ea426c3119', fieldMetadataUniversalIdentifier: F.motivoRecusa, position: 4, isVisible: true, size: 240 },
    { universalIdentifier: '70f8dcea-2364-486b-9c8d-340c8c074d74', fieldMetadataUniversalIdentifier: F.clienteNome, position: 5, isVisible: true, size: 180 },
    { universalIdentifier: '6e070d68-341e-4c59-aef8-6cad81f83864', fieldMetadataUniversalIdentifier: F.clienteEmail, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: 'ad221f3a-58cc-4adb-90ac-d9bca52f1bcb', fieldMetadataUniversalIdentifier: F.metodoPagamento, position: 7, isVisible: true, size: 150 },
    { universalIdentifier: '4739204f-5c6a-4bc1-8a5a-affb282788b4', fieldMetadataUniversalIdentifier: F.gateway, position: 8, isVisible: true, size: 130 },
    { universalIdentifier: '4c0500bd-a520-4880-be13-0b2753a79fa0', fieldMetadataUniversalIdentifier: F.idExterno, position: 9, isVisible: true, size: 180 },
  ],
  filters: [
    {
      universalIdentifier: '5f932713-0695-4990-9c9d-edabf90e49f4',
      fieldMetadataUniversalIdentifier: F.status,
      operand: ViewFilterOperand.IS,
      value: ['REEMBOLSADA'],
    },
  ],
  sorts: [
    { universalIdentifier: 'cb9b57a5-67a6-4814-81c2-93ac914039d4', fieldMetadataUniversalIdentifier: F.dataEvento, direction: ViewSortDirection.DESC },
  ],
});
