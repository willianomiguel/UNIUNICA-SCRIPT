import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/docs/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Wiki',
  icon: 'IconBook',
  color: 'purple',
  position: 60,
  type: NavigationMenuItemType.FOLDER,
});
