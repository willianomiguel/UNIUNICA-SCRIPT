import { registerEnumType } from '@nestjs/graphql';

import { EventLogTable } from 'integracore-shared/types';

export const registerEventLogTableEnum = () => {
  registerEnumType(EventLogTable, {
    name: 'EventLogTable',
  });
};
