import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/trafego/constants/pasta-menu.constant';

import { CAMPANHA_OBJECT_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '6d3e86fa-5a9c-4a1c-ae27-4a37a19156a5',
  name: 'Campanhas de tráfego',
  icon: 'IconSpeakerphone',
  color: 'blue',
  position: 51,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: CAMPANHA_OBJECT_ID,
});
