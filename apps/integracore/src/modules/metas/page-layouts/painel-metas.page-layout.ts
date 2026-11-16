import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'integra-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';

export default definePageLayout({
  universalIdentifier: METAS_IDS.PAGE_LAYOUT_PAINEL_METAS,
  name: 'Painel de metas',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'aa5dbfe0-468c-423f-aa74-28ad6ca5f450',
      title: 'Visão geral',
      position: 0,
      icon: 'IconTarget',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '0527159b-7068-4797-8c90-2dbffeb7c244',
          title: 'Metas',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: METAS_IDS.FRONT_PAINEL_METAS,
          },
        },
      ],
    },
  ],
});
