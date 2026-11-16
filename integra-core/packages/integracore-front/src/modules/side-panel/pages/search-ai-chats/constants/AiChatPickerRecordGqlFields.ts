import { type RecordGqlFields } from 'integracore-shared/types';

export const AI_CHAT_PICKER_RECORD_GQL_FIELDS = {
  id: true,
  title: true,
  conversationType: true,
  directMessageFirstWorkspaceMemberId: true,
  directMessageSecondWorkspaceMemberId: true,
} satisfies RecordGqlFields;
