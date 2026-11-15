import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { SPRINTS_IDS } from 'src/modules/sprints/constants/sprints-ids';

export default defineNavigationMenuItem({
  universalIdentifier: SPRINTS_IDS.navigation.tarefasSprintKanban,
  name: 'Tarefas em sprint',
  icon: 'IconChecklist',
  color: 'green',
  position: 22,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: SPRINTS_IDS.views.tarefasSprintKanban,
});
