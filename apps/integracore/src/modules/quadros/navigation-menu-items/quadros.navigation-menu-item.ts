import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/quadros/constants/pasta-menu.constant';
import { QUADROS_UNIVERSAL_IDENTIFIERS } from 'src/modules/quadros/constants/quadros-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.quadrosNavigationMenuItem,
  name: 'Quadros',
  icon: 'IconPresentation',
  color: 'purple',
  position: 80,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: QUADROS_UNIVERSAL_IDENTIFIERS.object,
});
