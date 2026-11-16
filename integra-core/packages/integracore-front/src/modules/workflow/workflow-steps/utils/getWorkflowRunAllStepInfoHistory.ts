import { isArray } from '@sniptt/guards';
import { isDefined } from 'integracore-shared/utils';
import { type WorkflowRunStepInfo } from 'integracore-shared/workflow';

export const getWorkflowRunAllStepInfoHistory = ({
  stepInfo,
}: {
  stepInfo: WorkflowRunStepInfo;
}) => {
  const iterationHistory = isArray(stepInfo?.history)
    ? stepInfo.history.filter((entry) => !isDefined(entry.retryAttempt))
    : [];

  const allStepInfoHistory: WorkflowRunStepInfo[] = [
    ...iterationHistory,
    stepInfo,
  ];

  return allStepInfoHistory;
};
