import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'integra-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';
import { VENDA_RECORD_PAGE_FIELDS_VIEW_ID } from 'src/modules/vendas/views/venda-record-page-fields.view';

export default definePageLayout({
  universalIdentifier: '4bf9cde9-db22-4b9a-85d2-570554fdd132',
  name: 'Página da venda',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: VENDAS_IDS.objetoVenda,
  tabs: [
    {
      universalIdentifier: 'd81f9b9b-2dd0-435e-9907-656571b96125',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'b2ba1eaf-abdb-440a-b35f-79dba4801620',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: VENDA_RECORD_PAGE_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: 'cec60c03-468d-4908-a42b-146c8e43d6e8',
      title: 'Histórico',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'e69bc118-571e-4d15-ad57-b702eba5c578',
          title: 'Histórico',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
