import { AppPath } from 'integracore-shared/types';
import { getAppPath } from 'integracore-shared/utils';

export const getCoreAgentLink = (agentId: string) =>
  getAppPath(AppPath.AgentShowPage, { agentId });
