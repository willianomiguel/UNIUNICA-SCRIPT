import { t } from 'integracore-sdk/front-component';
import { Section } from 'integracore-ui/components/layout';
import { IconCheck } from 'integracore-ui/icon';

import { SettingsOptionCardContentToggle } from 'src/front-components/components/SettingsOptionCardContentToggle';
import { StyledSettingsCard } from 'src/front-components/components/StyledSettingsCard';

export const LinkedinReadStatusSection = () => (
  <Section.Root>
    <Section.Header
      title={t('Read status')}
      description={t('Keep LinkedIn and IntegraCore in sync')}
    />
    <StyledSettingsCard>
      <SettingsOptionCardContentToggle
        Icon={IconCheck}
        title={t('Mark chats as read on LinkedIn')}
        description={t(
          'Coming soon: opening a chat in IntegraCore marks it as read on LinkedIn',
        )}
        disabled
        checked={false}
        onChange={() => undefined}
      />
    </StyledSettingsCard>
  </Section.Root>
);
