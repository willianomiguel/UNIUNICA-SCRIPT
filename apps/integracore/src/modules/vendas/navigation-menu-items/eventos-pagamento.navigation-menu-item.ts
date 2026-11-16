import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'integra-sdk/define';

import { PASTA_MENU_ID } from 'src/modules/vendas/constants/pasta-menu.constant';

import { VENDAS_IDS } from 'src/modules/vendas/constants/vendas-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'a9cdd382-f020-4639-9e9b-bed3dbdbf5aa',
  name: 'Eventos de pagamento',
  icon: 'IconWebhook',
  color: 'gray',
  position: 32,
  folderUniversalIdentifier: PASTA_MENU_ID,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: VENDAS_IDS.objetoEventoPagamento,
});
