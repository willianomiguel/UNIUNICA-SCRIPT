import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';

export default defineNavigationMenuItem({
  universalIdentifier: METAS_IDS.NAV_PAINEL_METAS,
  name: 'Painel de metas',
  icon: 'IconChartArrowsVertical',
  color: 'orange',
  position: 45,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: METAS_IDS.PAGE_LAYOUT_PAINEL_METAS,
});
