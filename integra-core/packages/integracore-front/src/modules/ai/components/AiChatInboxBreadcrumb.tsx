import { styled } from '@linaria/react';
import { AppPath } from 'integracore-shared/types';
import { getAppPath } from 'integracore-shared/utils';
import { themeCssVariables } from 'integracore-ui/theme';

import { AiChatInboxViewHeading } from '@/ai/components/AiChatInboxViewHeading';
import { UndecoratedLink } from '@/ui/navigation/link/components/UndecoratedLink/UndecoratedLink';

const StyledBreadcrumb = styled(UndecoratedLink)`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
  white-space: nowrap;
`;

export const AiChatInboxBreadcrumb = () => {
  return (
    <StyledBreadcrumb to={getAppPath(AppPath.AiChatInbox, { threadId: null })}>
      <AiChatInboxViewHeading />
      <span aria-hidden>/</span>
    </StyledBreadcrumb>
  );
};
