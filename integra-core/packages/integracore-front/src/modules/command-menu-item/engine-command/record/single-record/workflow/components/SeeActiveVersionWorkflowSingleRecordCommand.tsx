import { HeadlessNavigateEngineCommand } from '@/command-menu-item/engine-command/components/HeadlessNavigateEngineCommand';
import { useHeadlessCommandContextApi } from '@/command-menu-item/engine-command/hooks/useHeadlessCommandContextApi';
import { useActiveWorkflowVersion } from '@/workflow/hooks/useActiveWorkflowVersion';
import { AppPath } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';

export const SeeActiveVersionWorkflowSingleRecordCommand = () => {
  const { selectedRecords } = useHeadlessCommandContextApi();

  const recordId = selectedRecords[0]?.id;

  const { workflowVersion, hasDraftVersion, loading } =
    useActiveWorkflowVersion({
      workflowId: recordId ?? '',
    });

  if (!isDefined(recordId)) {
    throw new Error(
      doNotTranslate('Record ID is required to see active version workflow'),
    );
  }

  if (loading || !isDefined(workflowVersion)) {
    return null;
  }

  return (
    <HeadlessNavigateEngineCommand
      to={AppPath.WorkflowCoreShowPage}
      params={{ coreWorkflowId: recordId }}
      queryParams={
        hasDraftVersion ? { version: workflowVersion.id } : undefined
      }
    />
  );
};
