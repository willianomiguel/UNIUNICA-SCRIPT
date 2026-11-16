import { AppPath } from 'integracore-shared/types';

import { isMatchingPathname } from '~/utils/isMatchingPathname';

export const isAiChatPath = (pathname: string) =>
  isMatchingPathname(pathname, AppPath.AiChat);
