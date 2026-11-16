import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/metas/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Metas',
  icon: 'IconTarget',
  position: 45,
  type: NavigationMenuItemType.FOLDER,
});
