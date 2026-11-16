import { type ActorMetadata } from 'integracore-shared/types';

import { type UserWorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

export type RunAsWorkspaceMemberContext = {
  actorContext: ActorMetadata;
  authContext: UserWorkspaceAuthContext;
  roleId: string;
};
