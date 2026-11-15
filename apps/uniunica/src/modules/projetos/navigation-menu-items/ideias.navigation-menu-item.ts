import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { IDEIA_OBJECT_ID } from 'src/modules/projetos/constants/projetos-universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '5b336d58-7b98-43d8-a950-3a3fea927c3c',
  name: 'Ideias',
  icon: 'IconBulb',
  color: 'yellow',
  position: 12,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: IDEIA_OBJECT_ID,
});
