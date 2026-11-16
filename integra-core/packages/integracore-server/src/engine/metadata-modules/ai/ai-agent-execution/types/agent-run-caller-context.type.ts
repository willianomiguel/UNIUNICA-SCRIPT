import { type ActorMetadata } from 'integracore-shared/types';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

export type AgentRunCallerContext = {
  authContext: WorkspaceAuthContext;
  actorContext?: ActorMetadata;
};
