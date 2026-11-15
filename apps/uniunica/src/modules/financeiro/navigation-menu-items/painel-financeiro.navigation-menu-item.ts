import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';

export default defineNavigationMenuItem({
  universalIdentifier: FINANCEIRO_IDS.NAV_PAINEL,
  name: 'Painel Financeiro',
  icon: 'IconChartBar',
  color: 'green',
  position: 40,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: FINANCEIRO_IDS.PAGE_LAYOUT_PAINEL,
});
