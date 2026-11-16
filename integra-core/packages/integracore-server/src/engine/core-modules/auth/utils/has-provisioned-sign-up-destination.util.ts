import {
  isWorkspaceProvisioned,
  type WorkspaceActivationStatus,
} from 'integracore-shared/workspace';

export const hasProvisionedSignUpDestination = (
  availableWorkspacesForSignUp: {
    workspace: { activationStatus: WorkspaceActivationStatus };
  }[],
): boolean =>
  availableWorkspacesForSignUp.some(({ workspace }) =>
    isWorkspaceProvisioned(workspace),
  );
