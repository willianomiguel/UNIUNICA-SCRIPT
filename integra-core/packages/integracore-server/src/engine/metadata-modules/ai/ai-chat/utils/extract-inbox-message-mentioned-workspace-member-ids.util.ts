import { extractRecordReferenceIds } from 'integracore-shared/ai';
import { getMarkdownTextChatReferences } from 'integracore-shared/markdown';

export const extractInboxMessageMentionedWorkspaceMemberIds = (
  text: string,
): string[] =>
  extractRecordReferenceIds({
    text: getMarkdownTextChatReferences(text)
      .map(({ fullMatch }) => fullMatch)
      .join('\n'),
    objectNameSingular: 'workspaceMember',
  });
