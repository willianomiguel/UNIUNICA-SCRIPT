import { registerEnumType } from '@nestjs/graphql';

import { UpgradeHealthEnum } from 'integracore-shared/types';

export { UpgradeHealthEnum };

registerEnumType(UpgradeHealthEnum, {
  name: 'UpgradeHealth',
});
