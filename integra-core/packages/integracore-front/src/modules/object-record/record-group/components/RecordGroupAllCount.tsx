import { useGetRecordIndexTotalCount } from '@/views/hooks/internal/useGetRecordIndexTotalCount';
import { isDefined } from 'integracore-shared/utils';

export const RecordGroupAllCount = () => {
  const { totalCount } = useGetRecordIndexTotalCount();

  return isDefined(totalCount) ? totalCount : '-';
};
