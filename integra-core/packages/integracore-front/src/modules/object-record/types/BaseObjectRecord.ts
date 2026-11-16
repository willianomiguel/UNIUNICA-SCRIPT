import { type ObjectRecord as SharedObjectRecord } from 'integracore-shared/types';

export type BaseObjectRecord = SharedObjectRecord & {
  __typename: string;
};
