import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/sprints/constants/pasta-menu.constant';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.backlog,
  name: 'Backlog',
  icon: 'IconStack2',
  color: 'green',
  position: 23,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: SPRINTS_IDS.views.backlog,
});
