import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/vendas/constants/pasta-menu.constant';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '78ceb5ed-b5c0-4463-9b2f-8fca6f6f8d23',
  name: 'Vendas',
  icon: 'IconReceipt2',
  color: 'green',
  position: 31,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: VENDAS_IDS.objetoVenda,
});
