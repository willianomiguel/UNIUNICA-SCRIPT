import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/trafego/constants/pasta-menu.constant';

export default defineNavigationMenuItem({
  universalIdentifier: PASTA_MENU_ID,
  name: 'Tráfego',
  icon: 'IconSpeakerphone',
  color: 'sky',
  position: 50,
  type: NavigationMenuItemType.FOLDER,
});
