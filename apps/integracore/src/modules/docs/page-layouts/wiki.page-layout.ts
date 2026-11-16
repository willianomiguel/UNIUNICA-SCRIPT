import { definePageLayout, PageLayoutTabLayoutMode } from 'integra-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

const WIKI = DOCS_UNIVERSAL_IDENTIFIERS.wiki;

export default definePageLayout({
  universalIdentifier: WIKI.pageLayout,
  name: 'Wiki',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: WIKI.pageLayoutTab,
      title: 'Wiki',
      position: 0,
      icon: 'IconBook',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: WIKI.widget,
          title: 'Wiki',
          type: 'FRONT_COMPONENT',
          heightBehavior: 'TAB_VIEWPORT',
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: WIKI.frontComponent,
          },
        },
      ],
    },
  ],
});
