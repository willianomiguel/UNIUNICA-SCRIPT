import { defineNavigationMenuItem, NavigationMenuItemType } from 'integra-sdk/define';

import { COFRE_UNIVERSAL_IDENTIFIERS } from 'src/modules/cofre/constants/cofre-universal-identifiers';

// Tipo OBJECT de propósito: o IntegraCore esconde o item de quem não tem leitura no objeto.
// (Itens PAGE_LAYOUT e pastas vazias de usuário aparecem para todo mundo.)
export default defineNavigationMenuItem({
  universalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.navigationMenuItem,
  name: 'Cofre de acessos',
  icon: 'IconLock',
  color: 'red',
  position: 90,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: COFRE_UNIVERSAL_IDENTIFIERS.object,
});
