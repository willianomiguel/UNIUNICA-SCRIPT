import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/trafego/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Tráfego',
  icon: 'IconSpeakerphone',
  position: 50,
  type: NavigationMenuItemType.FOLDER,
});
