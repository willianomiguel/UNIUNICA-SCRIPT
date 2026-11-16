import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/docs/constants/pasta-menu.constant';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.documentosNavigationMenuItem,
  name: 'Documentos',
  icon: 'IconFileText',
  color: 'purple',
  position: 61,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
});
