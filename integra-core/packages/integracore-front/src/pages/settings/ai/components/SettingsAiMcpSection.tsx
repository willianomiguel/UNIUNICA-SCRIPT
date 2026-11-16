import { SETTINGS_AI_TABS } from '@/settings/ai/constants/SettingsAiTabs';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';
import { Section } from 'integracore-ui/components/layout';
import { IconSparkles } from 'integracore-ui/icon';
import { useTheme } from 'integracore-ui/theme';
import { useLingui } from '@lingui/react/macro';

export const SettingsAiMcpSection = () => {
  const { t } = useLingui();
  const theme = useTheme();

  return (
    <Section.Root>
      <Section.Header
        title={t`MCP Server`}
        description={t`Connect AI assistants like Claude or Cursor to your workspace via the Model Context Protocol`}
      />
      <SettingsCard
        Icon={<IconSparkles size={theme.icon.size.xl} />}
        title={t`Set up MCP`}
        to={getSettingsPath(
          SettingsPath.AI,
          undefined,
          undefined,
          SETTINGS_AI_TABS.TABS_IDS.MCP,
        )}
      />
    </Section.Root>
  );
};
