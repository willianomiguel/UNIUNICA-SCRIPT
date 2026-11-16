import { defineView, ViewType } from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

const F = VENDAS_IDS.eventoPagamento;

export const EVENTO_PAGAMENTO_RECORD_PAGE_FIELDS_VIEW_ID = '564fe30f-6cee-4c35-a6bc-4cee2a4eefed';

export default defineView({
  universalIdentifier: EVENTO_PAGAMENTO_RECORD_PAGE_FIELDS_VIEW_ID,
  name: 'Campos do evento de pagamento',
  objectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  type: ViewType.FIELDS_WIDGET,
  icon: 'IconListDetails',
  position: 0,
  fields: [
    { universalIdentifier: '5e1cfcd1-6d14-4fab-82d7-7056a7826332', fieldMetadataUniversalIdentifier: F.gateway, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: '80972216-1079-4cd8-b0c1-ca681ba5bd01', fieldMetadataUniversalIdentifier: F.recebidoEm, position: 1, isVisible: true, size: 200 },
    { universalIdentifier: 'ee9e6d83-ce1c-4c58-b3c0-4d3f7f33f512', fieldMetadataUniversalIdentifier: F.processado, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: '5877f087-da34-4417-8da3-09d73889e518', fieldMetadataUniversalIdentifier: F.erro, position: 3, isVisible: true, size: 200 },
    { universalIdentifier: '9c675a2d-cb81-42b7-9a1b-5a8f34d84a4c', fieldMetadataUniversalIdentifier: F.idExterno, position: 4, isVisible: true, size: 200 },
    { universalIdentifier: 'eb0181df-646d-4b1d-9964-7082b6669d03', fieldMetadataUniversalIdentifier: F.venda, position: 5, isVisible: true, size: 200 },
    { universalIdentifier: 'ff794d8b-acd2-45b4-aac0-5da4ccc3d7a3', fieldMetadataUniversalIdentifier: F.payload, position: 6, isVisible: true, size: 200 },
  ],
});
