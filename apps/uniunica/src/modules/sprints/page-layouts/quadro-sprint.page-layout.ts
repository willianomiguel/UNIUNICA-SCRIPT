import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

const P = SPRINTS_IDS.pageLayouts;

export default definePageLayout({
  universalIdentifier: P.quadro,
  name: 'Quadro da sprint',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: P.quadroTab,
      title: 'Quadro da sprint',
      position: 0,
      icon: 'IconLayoutKanban',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: P.quadroWidget,
          title: ' ',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: SPRINTS_IDS.frontComponents.quadro,
          },
        },
      ],
    },
  ],
});
