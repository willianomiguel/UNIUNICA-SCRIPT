import { useLingui } from '@lingui/react/macro';
import { Link, useLocation } from 'react-router-dom';
import { AppPath } from 'integracore-shared/types';
import { getAppPath } from 'integracore-shared/utils';
import { IconButton } from 'integracore-ui/components/input';
import { IconHome } from 'integracore-ui/icon';

import { AiChatCloseButton } from '@/ai/components/AiChatCloseButton';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { SidePanelToggleButton } from '@/side-panel/components/SidePanelToggleButton';
import { isAiChatInboxPath } from '~/utils/isAiChatInboxPath';

export const AiChatNewThreadPageActions = () => {
  const { t } = useLingui();
  const { pathname } = useLocation();
  const { defaultHomePagePath } = useDefaultHomePagePath();

  return (
    <>
      <IconButton
        size="sm"
        variant="outline"
        aria-label={t`Home`}
        nativeButton={false}
        render={<Link to={defaultHomePagePath} />}
      >
        <IconHome />
      </IconButton>
      <AiChatCloseButton
        destinationPath={
          isAiChatInboxPath(pathname)
            ? getAppPath(AppPath.AiChatInbox, { threadId: null })
            : undefined
        }
      />
      <SidePanelToggleButton />
    </>
  );
};
