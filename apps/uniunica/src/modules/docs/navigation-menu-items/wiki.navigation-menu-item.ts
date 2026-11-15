import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.wiki.navigationMenuItem,
  name: 'Wiki',
  icon: 'IconBook',
  color: 'blue',
  position: 60,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.wiki.pageLayout,
});
