import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'a9cdd382-f020-4639-9e9b-bed3dbdbf5aa',
  name: 'Eventos de pagamento',
  icon: 'IconWebhook',
  color: 'gray',
  position: 32,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
});
