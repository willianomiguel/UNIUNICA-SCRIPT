import { type RecordGqlOperationFilter } from 'integracore-shared/types';

export type FieldsHiddenOnMatchingRecords = {
  fieldMetadataIds: string[];
  recordFilter: RecordGqlOperationFilter;
};
