import { type ObjectRecord } from 'integracore-shared/types';

export type ObjectRecordOperationUpdateInput = {
  recordId: string;
  updatedFields: Record<string, unknown>[];
  updatedRecord?: ObjectRecord;
};
