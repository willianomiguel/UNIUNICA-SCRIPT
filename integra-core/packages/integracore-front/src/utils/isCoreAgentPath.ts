import { AppPath } from 'integracore-shared/types';

import { isMatchingPathname } from '~/utils/isMatchingPathname';

export const isCoreAgentPath = (pathname: string) =>
  isMatchingPathname(pathname, AppPath.AgentIndexPage) ||
  isMatchingPathname(pathname, AppPath.AgentShowPage);
