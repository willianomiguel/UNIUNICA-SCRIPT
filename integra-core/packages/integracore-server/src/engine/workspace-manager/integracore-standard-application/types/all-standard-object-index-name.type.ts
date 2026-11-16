import { type STANDARD_OBJECTS } from 'integracore-shared/metadata';

import { type AllStandardObjectName } from 'src/engine/workspace-manager/integracore-standard-application/types/all-standard-object-name.type';

export type AllStandardObjectIndexName<T extends AllStandardObjectName> =
  keyof (typeof STANDARD_OBJECTS)[T]['indexes'];
