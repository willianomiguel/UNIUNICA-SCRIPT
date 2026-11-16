import { StandardObjectNameSingular } from 'integracore-shared/types';

export const isWorkspaceWorkflowVersionRouteHidden = ({
  objectNameSingular,
}: {
  objectNameSingular?: string | null;
}) => objectNameSingular === StandardObjectNameSingular.WorkflowVersion;
