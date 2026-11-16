import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'integra-sdk/define';

import {
  ROADMAP_FRONT_COMPONENT_ID,
  ROADMAP_PAGE_LAYOUT_ID,
  ROADMAP_PAGE_LAYOUT_TAB_ID,
  ROADMAP_PAGE_LAYOUT_WIDGET_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default definePageLayout({
  universalIdentifier: ROADMAP_PAGE_LAYOUT_ID,
  name: 'Roadmap',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: ROADMAP_PAGE_LAYOUT_TAB_ID,
      title: 'Roadmap',
      position: 0,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: ROADMAP_PAGE_LAYOUT_WIDGET_ID,
          title: ' ',
          type: 'FRONT_COMPONENT',
          heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.TAB_VIEWPORT,
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: ROADMAP_FRONT_COMPONENT_ID,
          },
        },
      ],
    },
  ],
});
