import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { CAMPANHA_OBJECT_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '6d3e86fa-5a9c-4a1c-ae27-4a37a19156a5',
  name: 'Campanhas',
  icon: 'IconSpeakerphone',
  color: 'blue',
  position: 51,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: CAMPANHA_OBJECT_ID,
});
