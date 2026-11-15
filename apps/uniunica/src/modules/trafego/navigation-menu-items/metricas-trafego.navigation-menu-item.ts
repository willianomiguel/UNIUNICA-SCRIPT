import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { METRICA_TRAFEGO_OBJECT_ID } from 'src/modules/trafego/constants/trafego-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'f637a969-e2bc-4e9d-b00b-a2495539e975',
  name: 'Métricas de tráfego',
  icon: 'IconChartLine',
  color: 'blue',
  position: 52,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: METRICA_TRAFEGO_OBJECT_ID,
});
