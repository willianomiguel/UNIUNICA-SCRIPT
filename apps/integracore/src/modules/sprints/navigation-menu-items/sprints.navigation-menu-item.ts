import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/sprints/constants/pasta-menu.constant';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.sprints,
  name: 'Sprints',
  icon: 'IconRun',
  color: 'green',
  position: 20,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
});
