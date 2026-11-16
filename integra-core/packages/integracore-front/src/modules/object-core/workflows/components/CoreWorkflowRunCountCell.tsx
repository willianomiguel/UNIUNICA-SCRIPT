import { isDefined } from 'integracore-shared/utils';
import { Text } from 'integracore-ui/primitives/typography';

import { useNumberFormat } from '@/localization/hooks/useNumberFormat';

type CoreWorkflowRunCountCellProps = {
  runCount: number | null;
  isLowerBound: boolean;
};

export const CoreWorkflowRunCountCell = ({
  runCount,
  isLowerBound,
}: CoreWorkflowRunCountCellProps) => {
  const { formatNumber } = useNumberFormat();

  if (!isDefined(runCount)) {
    return null;
  }

  return (
    <Text truncate>
      {formatNumber(runCount)}
      {isLowerBound && '+'}
    </Text>
  );
};
