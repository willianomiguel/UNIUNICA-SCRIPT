import { styled } from '@linaria/react';
import { useState } from 'react';

import { EmailThreadMessage } from '@/activities/emails/components/EmailThreadMessage';
import { type EmailThreadMessageWithSender } from '@/activities/emails/types/EmailThreadMessageWithSender';
import { IconArrowsVertical } from 'integracore-ui/icon';
import { Button } from 'integracore-ui/primitives/input';
import { themeCssVariables } from 'integracore-ui/theme';
import { useLingui } from '@lingui/react/macro';

const StyledButtonContainer = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[10]};
`;

export const EmailThreadIntermediaryMessages = ({
  messages,
  onDraftClick,
}: {
  messages: EmailThreadMessageWithSender[];
  onDraftClick: (message: EmailThreadMessageWithSender) => void;
}) => {
  const { t } = useLingui();
  const [areMessagesOpen, setAreMessagesOpen] = useState(false);
  const messagesLength = messages.length;

  if (messagesLength === 0) {
    return null;
  }

  return areMessagesOpen ? (
    messages.map((message) => (
      <EmailThreadMessage
        key={message.id}
        message={message}
        onDraftClick={onDraftClick}
      />
    ))
  ) : (
    <StyledButtonContainer>
      <Button
        startIcon={<IconArrowsVertical />}
        size="sm"
        onClick={() => setAreMessagesOpen(true)}
      >{t`${messagesLength} emails`}</Button>
    </StyledButtonContainer>
  );
};
