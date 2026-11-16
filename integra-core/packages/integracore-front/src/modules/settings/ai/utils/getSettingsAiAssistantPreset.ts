import { type AiChatAssistantProfile } from 'integracore-shared/ai';
import { fastDeepEqual } from 'integracore-shared/utils';

export const getSettingsAiAssistantPreset = ({
  value,
  presets,
}: {
  value: AiChatAssistantProfile;
  presets: readonly AiChatAssistantProfile[];
}) => presets.find((preset) => fastDeepEqual(preset, value));
