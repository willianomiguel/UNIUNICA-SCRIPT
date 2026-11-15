import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default definePageLayout({
  universalIdentifier: FINANCEIRO_IDS.PAGE_LAYOUT_LANCAMENTO,
  name: 'Lançamento',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
  tabs: [
    {
      universalIdentifier: '409fe165-c06c-459d-842e-f316c624f32a',
      title: 'Início',
      position: 10,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '50353de2-c51b-4659-8359-10d082380513',
          title: 'Campos',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: FINANCEIRO_IDS.VIEW_LANCAMENTO_FIELDS,
          },
        },
      ],
    },
    {
      universalIdentifier: 'fb2efe12-dfc7-4d5e-b6a2-ec7bb4d23d0b',
      title: 'Histórico',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '5566ebf8-b782-4829-a811-597b67957481',
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
