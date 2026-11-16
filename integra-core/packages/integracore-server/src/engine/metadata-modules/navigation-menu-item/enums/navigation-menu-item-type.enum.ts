import { registerEnumType } from '@nestjs/graphql';

import { NavigationMenuItemType } from 'integracore-shared/types';

registerEnumType(NavigationMenuItemType, {
  name: 'NavigationMenuItemType',
});

export { NavigationMenuItemType };
