import { AppPath } from 'integracore-shared/types';

import { isMatchingPathname } from '~/utils/isMatchingPathname';

export const isAiChatInboxPath = (pathname: string) =>
  isMatchingPathname(pathname, AppPath.AiChatInbox);
