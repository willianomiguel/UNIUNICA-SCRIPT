import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  ROADMAP_NAVIGATION_MENU_ITEM_ID,
  ROADMAP_PAGE_LAYOUT_ID,
} from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: ROADMAP_NAVIGATION_MENU_ITEM_ID,
  name: 'Roadmap',
  icon: 'IconTimelineEvent',
  color: 'purple',
  position: 10,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: ROADMAP_PAGE_LAYOUT_ID,
});
