import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/metas/constants/pasta-menu.constant';

import { METAS_IDS } from 'src/modules/metas/constants/metas-ids';

export default defineNavigationMenuItem({
  universalIdentifier: METAS_IDS.NAV_PAINEL_METAS,
  name: 'Painel de metas',
  icon: 'IconChartArrowsVertical',
  color: 'orange',
  position: 45,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: METAS_IDS.PAGE_LAYOUT_PAINEL_METAS,
});
