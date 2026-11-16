import { ViewFilterGroupLogicalOperator } from '@/views/types/ViewFilterGroupLogicalOperator';
import { RecordFilterGroupLogicalOperator } from 'integracore-shared/types';

export const mapViewFilterGroupLogicalOperatorToRecordFilterGroupLogicalOperator =
  ({
    viewFilterGroupLogicalOperator,
  }: {
    viewFilterGroupLogicalOperator: ViewFilterGroupLogicalOperator;
  }) => {
    return viewFilterGroupLogicalOperator === ViewFilterGroupLogicalOperator.AND
      ? RecordFilterGroupLogicalOperator.AND
      : RecordFilterGroupLogicalOperator.OR;
  };
