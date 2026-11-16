import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';
import { Section } from 'integracore-ui/components/layout';
import { IconSparkles } from 'integracore-ui/icon';
import { SettingsAiSystemPromptsSection } from '~/pages/settings/ai/components/SettingsAiSystemPromptsSection';
import { SettingsAiWorkspaceInstructionsSection } from '~/pages/settings/ai/components/SettingsAiWorkspaceInstructionsSection';

export const settingsAiOverviewStorySections = {
  mcpSection: (
    <Section.Root>
      <Section.Header
        title="MCP Server"
        description="Connect AI assistants like Claude or Cursor to your workspace via the Model Context Protocol"
      />
      <SettingsCard
        Icon={<IconSparkles />}
        title="Set up MCP"
        to={getSettingsPath(SettingsPath.AI)}
      />
    </Section.Root>
  ),
  workspaceInstructionsSection: <SettingsAiWorkspaceInstructionsSection />,
  systemPromptSection: <SettingsAiSystemPromptsSection />,
};
