import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { EVENTO_PAGAMENTO_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/modules/vendas/views/evento-pagamento-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: '35996a1b-27ec-4848-bf74-e00ef6e071c3',
  name: 'Página do evento de pagamento',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
  tabs: [
    {
      universalIdentifier: '7621b8b9-bc46-4c01-9c2e-cf8f83a5833c',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '03ec1c5e-92b7-450a-ab2c-a6b15cbe82f8',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: EVENTO_PAGAMENTO_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
  ],
});
