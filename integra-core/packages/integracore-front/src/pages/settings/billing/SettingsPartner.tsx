import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';

import { SettingsBillingPartnerCodeForm } from '@/settings/billing/components/SettingsBillingPartnerCodeForm';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';

export const SettingsPartner = () => {
  const { t } = useLingui();

  return (
    <SettingsPageLayout
      title={t`Partner`}
      links={[
        { children: t`Workspace`, href: getSettingsPath(SettingsPath.General) },
        { children: t`Partner` },
      ]}
    >
      <SettingsPageContainer>
        <SettingsBillingPartnerCodeForm />
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
