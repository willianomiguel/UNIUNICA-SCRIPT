import { type SettingsAgentToolItem } from '~/pages/settings/ai/types/SettingsAgentToolItem';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';

export const getToolLink = (tool: SettingsAgentToolItem): string =>
  getSettingsPath(SettingsPath.AiToolDetail, {
    toolIdentifier: tool.identifier,
  });
