import { IconMicrophone } from 'integracore-ui/icon';
import { IconButton } from 'integracore-ui/components/input';

import { useDictation } from '@/ai/dictation/hooks/useDictation';
import { useLingui } from '@lingui/react/macro';

export const AiChatDictationButton = () => {
  const { t } = useLingui();
  const { isAvailable, isRecording, toggleDictation } = useDictation();

  if (!isAvailable) {
    return null;
  }

  const ariaLabel = isRecording ? t`Stop dictation` : t`Start dictation`;

  return (
    <IconButton
      variant="ghost"
      size="sm"
      color={isRecording ? 'danger' : 'neutral'}
      onClick={toggleDictation}
      aria-label={ariaLabel}
    >
      <IconMicrophone />
    </IconButton>
  );
};
