import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/metas/constants/pasta-menu.constant';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineNavigationMenuItem({
  universalIdentifier: METAS_IDS.NAV_METAS,
  name: 'Metas',
  icon: 'IconTarget',
  color: 'orange',
  position: 46,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
});
