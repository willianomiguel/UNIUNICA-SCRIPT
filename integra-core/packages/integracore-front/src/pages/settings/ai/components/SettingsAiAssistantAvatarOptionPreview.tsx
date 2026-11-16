import { type AiChatAssistantProfile } from 'integracore-shared/ai';
import { AssistantAvatar } from 'integracore-ui/components/data-display';
import { ColorSample } from 'integracore-ui/primitives/data-display';

type SettingsAiAssistantAvatarOptionPreviewProps = {
  value: Pick<
    AiChatAssistantProfile,
    'avatarColor' | 'avatarShape' | 'avatarFace'
  >;
  isColorPreview: boolean;
};

export const SettingsAiAssistantAvatarOptionPreview = ({
  value,
  isColorPreview,
}: SettingsAiAssistantAvatarOptionPreviewProps) => {
  if (isColorPreview) {
    return <ColorSample colorName={value.avatarColor} variant="circle" />;
  }

  return (
    <AssistantAvatar
      shape={value.avatarShape}
      color={value.avatarColor}
      face={value.avatarFace}
      size={16}
    />
  );
};
