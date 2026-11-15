import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.quadro,
  name: 'Quadro da sprint',
  icon: 'IconLayoutKanban',
  color: 'green',
  position: 21,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: SPRINTS_IDS.pageLayouts.quadro,
});
