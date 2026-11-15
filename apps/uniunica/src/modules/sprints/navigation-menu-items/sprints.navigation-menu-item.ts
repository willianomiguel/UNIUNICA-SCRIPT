import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.sprints,
  name: 'Sprints',
  icon: 'IconRun',
  color: 'green',
  position: 20,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: SPRINTS_IDS.objects.sprint,
});
