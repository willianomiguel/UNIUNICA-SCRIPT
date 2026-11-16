import { type LogicFunctionExecutionContext } from 'integracore-sdk/logic-function';

export const buildLogicFunctionExecutionContext = (
  userWorkspaceId: string | null,
): LogicFunctionExecutionContext => ({
  retryCount: 0,
  maxRetries: 3,
  workspaceId: 'workspace-1',
  userWorkspaceId,
  workspaceMemberId: null,
});
