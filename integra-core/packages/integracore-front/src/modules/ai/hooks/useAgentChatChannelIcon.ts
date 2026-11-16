import { isDefined } from 'integracore-shared/utils';
import { IconHash } from 'integracore-ui/icon';
import { useIcons } from 'integracore-ui/icon/provider';

// The icon set loads lazily, so the default stands in until it has
export const useAgentChatChannelIcon = (icon: string | null | undefined) => {
  const { getIcons } = useIcons();

  return (isDefined(icon) ? getIcons()[icon] : undefined) ?? IconHash;
};
