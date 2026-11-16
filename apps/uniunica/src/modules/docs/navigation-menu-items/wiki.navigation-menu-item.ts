import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/docs/constants/pasta-menu.constant';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.wiki.navigationMenuItem,
  name: 'Wiki',
  icon: 'IconBook',
  color: 'blue',
  position: 60,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.wiki.pageLayout,
});
