import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/financeiro/constants/pasta-menu.constant';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineNavigationMenuItem({
  universalIdentifier: FINANCEIRO_IDS.NAV_LANCAMENTOS,
  name: 'Lançamentos',
  icon: 'IconCash',
  color: 'green',
  position: 41,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
});
