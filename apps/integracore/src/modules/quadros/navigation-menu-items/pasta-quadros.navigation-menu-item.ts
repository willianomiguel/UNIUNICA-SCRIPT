import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/quadros/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Quadros',
  icon: 'IconPresentation',
  color: 'mint',
  position: 80,
  type: NavigationMenuItemType.FOLDER,
});
