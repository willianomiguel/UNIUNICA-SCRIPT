import { type ObjectRecord } from 'integracore-shared/types';

export type PartialObjectRecordWithId = Partial<ObjectRecord> & { id: string };
