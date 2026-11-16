import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/projetos/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Projetos',
  icon: 'IconRocket',
  color: 'iris',
  position: 10,
  type: NavigationMenuItemType.FOLDER,
});
