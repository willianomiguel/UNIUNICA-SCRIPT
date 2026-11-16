import { type BlocklistScope } from 'integracore-shared/types';

export type BlocklistItem = {
  id: string;
  handle: string;
  scope: BlocklistScope;
  workspaceMemberId: string | null;
  createdAt: string;
  __typename: 'BlocklistItem';
};
