import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { FINANCEIRO_IDS } from 'src/modules/financeiro/constants/financeiro-ids';
import { OBJECTS } from 'src/modules/shared/constants/objects';

export default defineNavigationMenuItem({
  universalIdentifier: FINANCEIRO_IDS.NAV_CATEGORIAS,
  name: 'Categorias financeiras',
  icon: 'IconCategory',
  color: 'green',
  position: 42,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier:
    OBJECTS.categoriaFinanceira.universalIdentifier,
});
