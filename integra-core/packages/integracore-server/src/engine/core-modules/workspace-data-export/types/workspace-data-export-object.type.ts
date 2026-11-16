import { type RecordExportColumn } from 'integracore-shared/types';

export type WorkspaceDataExportObject = {
  objectMetadataId: string;
  nameSingular: string;
  labelSingular: string;
  columns: RecordExportColumn[];
  fieldCount: number;
};
