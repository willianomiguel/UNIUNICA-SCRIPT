import { ViewVisibility } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const isViewVisibleToUser = (
  view: {
    visibility: ViewVisibility;
    createdByUserWorkspaceId?: string | null;
  },
  userWorkspaceId?: string,
): boolean => {
  if (view.visibility === ViewVisibility.WORKSPACE) {
    return true;
  }

  return (
    view.visibility === ViewVisibility.UNLISTED &&
    isDefined(userWorkspaceId) &&
    view.createdByUserWorkspaceId === userWorkspaceId
  );
};
