import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineNavigationMenuItem({
  universalIdentifier: METAS_IDS.NAV_METAS,
  name: 'Metas',
  icon: 'IconTarget',
  color: 'orange',
  position: 46,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECTS.meta.universalIdentifier,
});
