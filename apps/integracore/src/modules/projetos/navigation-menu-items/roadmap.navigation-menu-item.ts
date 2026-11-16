import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/projetos/constants/pasta-menu.constant';

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
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: ROADMAP_PAGE_LAYOUT_ID,
});
