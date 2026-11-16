import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.venda;

export default defineView({
  universalIdentifier: '1a022798-ba0e-4301-a623-a6f9e039aaae',
  name: 'Chargebacks',
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  type: ViewType.TABLE,
  icon: 'IconShieldX',
  position: 2,
  fields: [
    { universalIdentifier: 'cb3b9a89-d3cb-4d30-93ce-5c2d25a42dff', fieldMetadataUniversalIdentifier: F.descricao, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: '760c193f-6a1d-47cd-a59d-d7ec487890e7', fieldMetadataUniversalIdentifier: F.dataEvento, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: '36d64bf9-641c-432f-a432-69cba121cfb5', fieldMetadataUniversalIdentifier: F.status, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'f434aa86-46c1-4d3c-821a-cd85a0371fa3', fieldMetadataUniversalIdentifier: F.valor, position: 3, isVisible: true, size: 130 },
    { universalIdentifier: '4bd48cad-a372-472f-ba89-3da775b9283b', fieldMetadataUniversalIdentifier: F.motivoRecusa, position: 4, isVisible: true, size: 240 },
    { universalIdentifier: '2443fd7c-61c8-4ed1-bf28-1ba8460587aa', fieldMetadataUniversalIdentifier: F.clienteNome, position: 5, isVisible: true, size: 180 },
    { universalIdentifier: '8478a746-472a-409d-9ab9-8525f8078f2a', fieldMetadataUniversalIdentifier: F.clienteEmail, position: 6, isVisible: true, size: 200 },
    { universalIdentifier: 'e13b2d98-5b6b-4583-9634-93831337a867', fieldMetadataUniversalIdentifier: F.metodoPagamento, position: 7, isVisible: true, size: 150 },
    { universalIdentifier: '98f67dbd-4a60-4575-8d5a-707317ed3ccf', fieldMetadataUniversalIdentifier: F.gateway, position: 8, isVisible: true, size: 130 },
    { universalIdentifier: '29da0d8a-7eeb-40df-8a8a-5f0be3c9dc3d', fieldMetadataUniversalIdentifier: F.idExterno, position: 9, isVisible: true, size: 180 },
  ],
  filters: [
    {
      universalIdentifier: '3823a701-80ee-4df4-8d30-5b3a4e3dc469',
      fieldMetadataUniversalIdentifier: F.status,
      operand: ViewFilterOperand.IS,
      value: ['CHARGEBACK'],
    },
  ],
  sorts: [
    { universalIdentifier: '392e4375-52e9-4d6b-a9fa-4a98861ca2f4', fieldMetadataUniversalIdentifier: F.dataEvento, direction: ViewSortDirection.DESC },
  ],
});
