import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'integracore-shared/types';
import { getSettingsPath, isDefined } from 'integracore-shared/utils';
import { Section } from 'integracore-ui/components/layout';
import { IconPlus } from 'integracore-ui/icon';
import { themeCssVariables, useTheme } from 'integracore-ui/theme';

import { USAGE_LIMIT_PRESET_QUERY_PARAM } from '@/settings/billing/constants/UsageLimitPresetQueryParam';
import { USAGE_LIMIT_PRESETS } from '@/settings/billing/constants/UsageLimitPresets';
import { isUsageLimitPresetAvailable } from '@/settings/billing/utils/isUsageLimitPresetAvailable';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { type UsageQuotaDefinitionsQuery } from '~/generated-metadata/graphql';

const StyledCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

type SettingsBillingLimitsEmptyStateProps = {
  definitions?: UsageQuotaDefinitionsQuery['usageQuotaDefinitions'];
};

export const SettingsBillingLimitsEmptyState = ({
  definitions,
}: SettingsBillingLimitsEmptyStateProps) => {
  const { t } = useLingui();
  const theme = useTheme();

  const presetEntries = isDefined(definitions)
    ? Object.entries(USAGE_LIMIT_PRESETS).filter(([, preset]) =>
        isUsageLimitPresetAvailable({ definitions, preset }),
      )
    : [];

  return (
    <Section.Root>
      <Section.Header
        title={t`Limits`}
        description={t`Cap what your workspace can spend. Start from a common limit or build your own.`}
      />
      <StyledCards>
        {presetEntries.map(([presetId, preset]) => (
          <SettingsCard
            key={presetId}
            to={getSettingsPath(SettingsPath.BillingNewLimit, undefined, {
              [USAGE_LIMIT_PRESET_QUERY_PARAM]: presetId,
            })}
            Icon={<preset.Icon size={theme.icon.size.md} />}
            title={t(preset.title)}
            description={t(preset.description)}
          />
        ))}
        <SettingsCard
          to={getSettingsPath(SettingsPath.BillingNewLimit)}
          Icon={<IconPlus size={theme.icon.size.md} />}
          title={t`Start from scratch`}
          description={t`Choose any usage, who it applies to and how often it resets.`}
        />
      </StyledCards>
    </Section.Root>
  );
};
