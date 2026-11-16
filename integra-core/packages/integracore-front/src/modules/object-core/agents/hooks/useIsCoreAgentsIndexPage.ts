import { matchPath, useLocation } from 'react-router-dom';
import { AppPath } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const useIsCoreAgentsIndexPage = () => {
  const location = useLocation();

  return isDefined(matchPath(AppPath.AgentIndexPage, location.pathname));
};
