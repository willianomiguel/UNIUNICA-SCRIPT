import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/vendas/constants/pasta-menu.constant';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '7b9309db-5903-43ef-b95e-860267805655',
  name: 'Painel de Vendas',
  icon: 'IconChartBar',
  color: 'green',
  position: 30,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: VENDAS_IDS.painelPageLayout,
});
