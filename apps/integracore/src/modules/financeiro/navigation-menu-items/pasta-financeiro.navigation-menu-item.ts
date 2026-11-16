import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/financeiro/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Financeiro',
  icon: 'IconCash',
  color: 'amber',
  position: 40,
  type: NavigationMenuItemType.FOLDER,
});
