import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default definePageLayout({
  universalIdentifier: METAS_IDS.PAGE_LAYOUT_META,
  name: 'Meta',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
  tabs: [
    {
      universalIdentifier: 'e2368699-ade5-4975-8cc7-071696b5e1d9',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '5d523d2c-bf1e-4e4f-bcc4-51266ce8bbfd',
          title: 'Progresso',
          type: 'FRONT_COMPONENT',
          objectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: METAS_IDS.FRONT_PROGRESSO,
          },
        },
        {
          universalIdentifier: '49c82489-7164-4052-8015-15b5e4cd3cb9',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: METAS_IDS.VIEW_META_FIELDS,
          },
        },
      ],
    },
    {
      universalIdentifier: '2ed0532c-4549-4c42-9474-9012f354a8f7',
      title: 'Histórico',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: 'bd4baa56-b7ca-42f3-964f-c352cfcb850a',
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
