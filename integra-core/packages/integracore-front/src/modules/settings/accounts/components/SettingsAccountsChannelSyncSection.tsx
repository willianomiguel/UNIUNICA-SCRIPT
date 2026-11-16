import { SettingsOptionCardContentSwitch } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSwitch';
import { useLingui } from '@lingui/react/macro';
import { Section } from 'integracore-ui/components/layout';
import { IconRefresh } from 'integracore-ui/icon';
import { Card } from 'integracore-ui/primitives/surfaces';

type SettingsAccountsChannelSyncSectionProps = {
  sectionDescription: string;
  switchTitle: string;
  switchDescription: string;
  isSyncEnabled: boolean;
  onIsSyncEnabledChange: (isSyncEnabled: boolean) => void;
};

export const SettingsAccountsChannelSyncSection = ({
  sectionDescription,
  switchTitle,
  switchDescription,
  isSyncEnabled,
  onIsSyncEnabledChange,
}: SettingsAccountsChannelSyncSectionProps) => {
  const { t } = useLingui();

  return (
    <Section.Root>
      <Section.Header title={t`Sync`} description={sectionDescription} />
      <Card.Root>
        <SettingsOptionCardContentSwitch
          Icon={IconRefresh}
          title={switchTitle}
          description={switchDescription}
          checked={isSyncEnabled}
          onChange={() => onIsSyncEnabledChange(!isSyncEnabled)}
        />
      </Card.Root>
    </Section.Root>
  );
};
