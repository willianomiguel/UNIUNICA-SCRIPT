import { NavigationButton } from '@/ui/input/components/NavigationButton';

import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath } from 'integracore-shared/utils';
import { IconPlus } from 'integracore-ui/icon';

import { SettingsBillingLimitsContent } from '@/settings/billing/components/SettingsBillingLimitsContent';
import { SettingsBillingPageLayout } from '@/settings/billing/components/SettingsBillingPageLayout';

export const SettingsBillingLimits = () => {
  const { t } = useLingui();

  return (
    <SettingsBillingPageLayout
      actionButton={
        <NavigationButton
          to={getSettingsPath(SettingsPath.BillingNewLimit)}
          startIcon={<IconPlus />}
          size="sm"
          variant="solid"
          color="accent"
        >{t`New limit`}</NavigationButton>
      }
    >
      <SettingsBillingLimitsContent />
    </SettingsBillingPageLayout>
  );
};
