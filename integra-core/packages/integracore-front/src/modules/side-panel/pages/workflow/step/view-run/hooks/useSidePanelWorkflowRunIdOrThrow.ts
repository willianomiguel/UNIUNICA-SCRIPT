import { sidePanelWorkflowRunIdComponentState } from '@/side-panel/pages/workflow/states/sidePanelWorkflowRunIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { isDefined } from 'integracore-shared/utils';
import { doNotTranslate } from 'integracore-shared/i18n';

export const useSidePanelWorkflowRunIdOrThrow = () => {
  const sidePanelWorkflowRunId = useAtomComponentStateValue(
    sidePanelWorkflowRunIdComponentState,
  );
  if (!isDefined(sidePanelWorkflowRunId)) {
    throw new Error(
      doNotTranslate(
        'Expected the sidePanelWorkflowRunIdComponentState to be defined.',
      ),
    );
  }

  return sidePanelWorkflowRunId;
};
