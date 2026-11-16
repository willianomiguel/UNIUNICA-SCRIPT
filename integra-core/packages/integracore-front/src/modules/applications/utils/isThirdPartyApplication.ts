import { isIntegraCoreStandardApplication } from '@/applications/utils/isIntegraCoreStandardApplication';
import { isWorkspaceCustomApplication } from '@/applications/utils/isWorkspaceCustomApplication';
import { isDefined } from 'integracore-shared/utils';

type ApplicationLike = {
  id?: string | null;
  universalIdentifier?: string | null;
};

type WorkspaceLike = {
  workspaceCustomApplication?: { id?: string | null } | null;
};

export const isThirdPartyApplication = ({
  application,
  currentWorkspace,
}: {
  application: ApplicationLike | null | undefined;
  currentWorkspace: WorkspaceLike | null | undefined;
}): boolean => {
  return (
    isDefined(application) &&
    !isIntegraCoreStandardApplication(application) &&
    !isWorkspaceCustomApplication(application, currentWorkspace)
  );
};
