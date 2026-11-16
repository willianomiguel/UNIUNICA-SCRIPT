import { isUndefined } from '@sniptt/guards';
import { safeGetNestedProperty } from 'integracore-shared/utils';

export const isRecordFieldValueLoaded = ({
  record,
  fieldPath,
}: {
  record: Record<string, unknown>;
  fieldPath: string;
}): boolean => !isUndefined(safeGetNestedProperty(record, fieldPath));
