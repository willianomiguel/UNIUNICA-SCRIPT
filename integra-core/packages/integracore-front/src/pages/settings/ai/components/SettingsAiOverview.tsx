import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';
import { type SettingsAiOverviewProps } from '~/pages/settings/ai/types/SettingsAiOverviewProps';
import { useLingui } from '@lingui/react/macro';

export const SettingsAiOverview = ({
  avatarSection,
  behaviorSection,
  summarySection,
  secondaryBar,
  mcpSection,
  workspaceInstructionsSection,
  systemPromptSection,
}: SettingsAiOverviewProps) => {
  const { t } = useLingui();
  return (
    <SettingsPageLayout
      title={t`AI`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.General),
        },
        { children: t`AI` },
      ]}
      secondaryBar={secondaryBar}
    >
      <SettingsPageContainer>
        {avatarSection}
        {behaviorSection}
        {summarySection}
        {mcpSection}
        {workspaceInstructionsSection}
        {systemPromptSection}
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
