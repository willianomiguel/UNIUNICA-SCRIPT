import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';

import {
  CAMPANHA_OBJECT_ID,
  CAMPANHA_RECORD_PAGE_LAYOUT_ID,
  CAMPANHA_RECORD_FIELDS_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default definePageLayout({
  universalIdentifier: CAMPANHA_RECORD_PAGE_LAYOUT_ID,
  name: 'Página da campanha',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: CAMPANHA_OBJECT_ID,
  tabs: [
    {
      universalIdentifier: 'caec0fb2-68db-46be-9f95-00df8f8cf287',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '15c737f9-065f-495f-a2b2-92ef3405ec00',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: CAMPANHA_RECORD_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: '16744fb2-9d14-4851-b17e-27f192ddc8e8',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '0c6beb30-7ef5-4d88-9732-d98362a67891',
          title: 'Linha do tempo',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
