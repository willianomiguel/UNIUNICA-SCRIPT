import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/financeiro/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Financeiro',
  icon: 'IconCash',
  position: 40,
  type: NavigationMenuItemType.FOLDER,
});
