import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.backlog,
  name: 'Backlog',
  icon: 'IconStack2',
  color: 'green',
  position: 23,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: SPRINTS_IDS.views.backlog,
});
