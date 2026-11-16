import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/sprints/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Sprints',
  icon: 'IconRun',
  color: 'cyan',
  position: 20,
  type: NavigationMenuItemType.FOLDER,
});
