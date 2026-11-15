import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '7b9309db-5903-43ef-b95e-860267805655',
  name: 'Painel de Vendas',
  icon: 'IconChartBar',
  color: 'green',
  position: 30,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: VENDAS_IDS.painelPageLayout,
});
