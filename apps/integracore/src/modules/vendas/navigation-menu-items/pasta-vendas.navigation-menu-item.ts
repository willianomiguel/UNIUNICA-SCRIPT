import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/vendas/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Vendas',
  color: 'green',
  icon: 'IconReceipt2',
  position: 30,
  type: NavigationMenuItemType.FOLDER,
});
