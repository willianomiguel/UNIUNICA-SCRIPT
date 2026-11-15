import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineNavigationMenuItem({
  universalIdentifier: FINANCEIRO_IDS.NAV_LANCAMENTOS,
  name: 'Lançamentos',
  icon: 'IconCash',
  color: 'green',
  position: 41,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: OBJECTS.lancamento.universalIdentifier,
});
