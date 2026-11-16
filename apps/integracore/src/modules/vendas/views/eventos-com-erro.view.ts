import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.eventoPagamento;

export default defineView({
  universalIdentifier: '0d7a70e4-d8cb-4f69-9f8e-9a2f3f632c48',
  name: 'Não processados',
  objectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 1,
  fields: [
    { universalIdentifier: '2a43f44b-9a57-4c40-9e04-0df79826444f', fieldMetadataUniversalIdentifier: F.tipo, position: 0, isVisible: true, size: 240 },
    { universalIdentifier: 'add82cea-4c1e-4e18-9cb2-049d5b29aab3', fieldMetadataUniversalIdentifier: F.recebidoEm, position: 1, isVisible: true, size: 160 },
    { universalIdentifier: 'b6d823aa-8579-4e56-941d-302ae0814088', fieldMetadataUniversalIdentifier: F.gateway, position: 2, isVisible: true, size: 130 },
    { universalIdentifier: 'a733647b-ebfd-4c41-a4e7-824c35426e05', fieldMetadataUniversalIdentifier: F.erro, position: 3, isVisible: true, size: 300 },
    { universalIdentifier: 'a000d50d-bd14-4271-aa4e-2a4c12018435', fieldMetadataUniversalIdentifier: F.payload, position: 4, isVisible: true, size: 260 },
  ],
  filters: [
    {
      universalIdentifier: '8f00e69d-d42a-4011-8234-b68d5b3a84e7',
      fieldMetadataUniversalIdentifier: F.processado,
      operand: ViewFilterOperand.IS,
      value: false,
    },
  ],
  sorts: [
    { universalIdentifier: '8bb9e4f1-f344-4ae8-81a3-0fa1c1f477ca', fieldMetadataUniversalIdentifier: F.recebidoEm, direction: ViewSortDirection.DESC },
  ],
});
