import { HeadlessNavigateEngineCommand } from '@/command-menu-item/engine-command/components/HeadlessNavigateEngineCommand';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { StandardObjectNamePlural } from '@/object-metadata/types/StandardObjectNamePlural';
import { AppPath, ViewFilterOperand } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';

export const SeeRunsWorkflowSingleRecordCommand = () => {
  const { selectedRecords } = useHeadlessCommandContextApi();

  const recordId = selectedRecords[0]?.id;
  const workflowName = selectedRecords[0]?.name;

  if (!isDefined(recordId)) {
    throw new Error(
      doNotTranslate('Record ID is required to see runs workflow'),
    );
  }

  return (
    <HeadlessNavigateEngineCommand
      to={AppPath.RecordIndexPage}
      params={{ objectNamePlural: StandardObjectNamePlural.WorkflowRun }}
      queryParams={{
        filter: { coreWorkflowId: { [ViewFilterOperand.IS]: recordId } },
        filterDisplayValue: {
          coreWorkflowId: { [ViewFilterOperand.IS]: workflowName },
        },
      }}
    />
  );
};
