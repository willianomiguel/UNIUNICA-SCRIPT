import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/projetos/constants/pasta-menu.constant';

import { PROJETO_OBJECT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '772cc180-ba42-4f59-918b-be58fd772023',
  name: 'Projetos',
  icon: 'IconRocket',
  color: 'blue',
  position: 11,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: PROJETO_OBJECT_ID,
});
