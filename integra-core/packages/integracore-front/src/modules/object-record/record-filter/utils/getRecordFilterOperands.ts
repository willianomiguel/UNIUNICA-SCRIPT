import {
  type FilterableAndTSVectorFieldType,
  type RecordFilterOperand,
} from 'integracore-shared/types';
import { getFilterOperandsForFilterableFieldType } from 'integracore-shared/utils';

export const getRecordFilterOperands = ({
  filterType,
  subFieldName,
}: {
  filterType: FilterableAndTSVectorFieldType;
  subFieldName?: string | null | undefined;
}): readonly RecordFilterOperand[] => {
  return getFilterOperandsForFilterableFieldType({
    filterType,
    subFieldName,
  });
};
