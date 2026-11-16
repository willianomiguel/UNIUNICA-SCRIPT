import {
  type ExtendedUIMessagePart,
  isSucceededCompleteWorkspaceSetupToolPart,
} from 'integracore-shared/ai';

export const extractCompletedWorkspaceSetupToolParts = (
  messageParts: ExtendedUIMessagePart[],
): { toolCallId: string }[] =>
  messageParts
    .filter(isSucceededCompleteWorkspaceSetupToolPart)
    .map((part) => ({ toolCallId: part.toolCallId }));
