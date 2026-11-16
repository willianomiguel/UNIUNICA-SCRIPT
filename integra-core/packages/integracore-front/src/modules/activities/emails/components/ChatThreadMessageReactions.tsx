import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'integracore-shared/utils';
import { ReactionButton } from 'integracore-ui/components/input';
import { Tooltip } from 'integracore-ui/primitives/surfaces';
import { themeCssVariables } from 'integracore-ui/theme';

import { type ChatMessageReaction } from '@/activities/emails/types/ChatMessageReaction';
import { formatDisplayList } from '~/utils/format/formatDisplayList';

const StyledReactions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledReaction = styled.span`
  display: inline-flex;
`;

type ChatThreadMessageReactionsProps = {
  reactions: ChatMessageReaction[];
  onReactionToggle?: (emoji: string) => void;
};

export const ChatThreadMessageReactions = ({
  reactions,
  onReactionToggle,
}: ChatThreadMessageReactionsProps) => {
  const { t } = useLingui();

  return (
    <StyledReactions>
      {reactions.map(({ emoji, count, isOwn, reactorNames }) => {
        const reactors = formatDisplayList(reactorNames);

        return (
          <Tooltip key={emoji} content={reactors}>
            <StyledReaction>
              <ReactionButton
                emoji={emoji}
                count={count}
                pressed={isOwn}
                aria-label={t`${emoji} by ${reactors}`}
                disabled={!isDefined(onReactionToggle)}
                onPressedChange={() => onReactionToggle?.(emoji)}
              />
            </StyledReaction>
          </Tooltip>
        );
      })}
    </StyledReactions>
  );
};
