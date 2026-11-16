import { HeadlessNavigateEngineCommand } from '@/command-menu-item/engine-command/components/HeadlessNavigateEngineCommand';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { AppPath, StandardObjectNameSingular } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';

export const SeeVersionWorkflowRunSingleRecordCommand = () => {
  const { selectedRecords } = useHeadlessCommandContextApi();
  const selectedRecord = selectedRecords[0];

  if (
    !isDefined(selectedRecord) ||
    !isDefined(selectedRecord?.workflowVersion?.id)
  ) {
    throw new Error(
      doNotTranslate('Selected record is required to see version workflow run'),
    );
  }

  return (
    <HeadlessNavigateEngineCommand
      to={AppPath.RecordShowPage}
      params={{
        objectNameSingular: StandardObjectNameSingular.WorkflowVersion,
        objectRecordId: selectedRecord.workflowVersion.id,
      }}
    />
  );
};
