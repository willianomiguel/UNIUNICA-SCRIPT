import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { DOCS_UNIVERSAL_IDENTIFIERS } from 'src/modules/docs/constants/docs-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.documentosNavigationMenuItem,
  name: 'Documentos',
  icon: 'IconFileText',
  color: 'blue',
  position: 61,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: DOCS_UNIVERSAL_IDENTIFIERS.object,
});
