import { type RecordGqlOperationFilter } from 'integracore-shared/types';

export type FrontComponentRecordContext = {
  objectNameSingular?: string;
  selectedRecordIds?: string[];
  selectedRecordsFilter?: RecordGqlOperationFilter | null;
};
