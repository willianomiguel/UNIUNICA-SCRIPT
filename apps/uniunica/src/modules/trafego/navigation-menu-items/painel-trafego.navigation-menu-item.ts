import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PAINEL_TRAFEGO_PAGE_LAYOUT_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'c71c9ffd-c00f-499c-a14d-391b8ebdf68e',
  name: 'Painel de Tráfego',
  icon: 'IconChartBar',
  color: 'blue',
  position: 50,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: PAINEL_TRAFEGO_PAGE_LAYOUT_ID,
});
