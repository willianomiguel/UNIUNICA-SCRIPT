import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'integra-sdk/define';

import {
  METRICA_TRAFEGO_OBJECT_ID,
  METRICA_RECORD_PAGE_LAYOUT_ID,
  METRICA_RECORD_FIELDS_VIEW_ID,
} from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default definePageLayout({
  universalIdentifier: METRICA_RECORD_PAGE_LAYOUT_ID,
  name: 'Página da métrica de tráfego',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
  tabs: [
    {
      universalIdentifier: '56881b11-2082-4fb1-b197-75cd84efc230',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '589af8a0-707b-48f8-b4cb-8abd07ee445a',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: METRICA_RECORD_FIELDS_VIEW_ID,
          },
        },
      ],
    },
    {
      universalIdentifier: 'e949f695-2002-4299-84b9-0e9390775c19',
      title: 'Linha do tempo',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '22eb61b2-fe46-432d-bc68-9f1fa8ec4457',
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
