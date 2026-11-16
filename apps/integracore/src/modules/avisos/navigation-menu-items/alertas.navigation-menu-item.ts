import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { AVISOS_UNIVERSAL_IDENTIFIERS } from 'src/modules/avisos/constants/avisos-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.navigationMenuItem,
  name: 'Alertas',
  icon: 'IconBell',
  color: 'red',
  position: 70,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: AVISOS_UNIVERSAL_IDENTIFIERS.object,
});
