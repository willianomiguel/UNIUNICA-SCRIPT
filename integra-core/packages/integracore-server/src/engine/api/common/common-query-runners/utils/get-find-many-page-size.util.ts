import { QUERY_MAX_RECORDS } from 'integracore-shared/constants';

export const getFindManyPageSize = ({
  first,
  last,
  shouldBypassQueryMaxRecords = false,
}: {
  first?: number | null;
  last?: number | null;
  shouldBypassQueryMaxRecords?: boolean;
}): number => {
  const pageSize = first ?? last ?? QUERY_MAX_RECORDS;

  return shouldBypassQueryMaxRecords
    ? pageSize
    : Math.min(pageSize, QUERY_MAX_RECORDS);
};
