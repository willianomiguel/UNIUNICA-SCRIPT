import { useLingui } from '@lingui/react/macro';
import { Section } from 'integracore-ui/components/layout';
import { IconChartLine } from 'integracore-ui/icon';
import { Card } from 'integracore-ui/primitives/surfaces';

import { getWorkspaceAiDataPolicy } from '@/ai/utils/getWorkspaceAiDataPolicy';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SettingsOptionCardContentSwitch } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSwitch';
import { useIsIntegraCoreCloud } from '@/settings/privacy/hooks/useIsIntegraCoreCloud';
import { useUpdateWorkspaceAiDataPolicyField } from '@/settings/privacy/hooks/useUpdateWorkspaceAiDataPolicyField';
import { ImpersonationSwitch } from '@/settings/workspace/components/ImpersonationSwitch';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const SettingsPrivacySharingWithIntegraCore = () => {
  const { t } = useLingui();
  const isIntegraCoreCloud = useIsIntegraCoreCloud();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const { updateWorkspaceAiDataPolicyField } =
    useUpdateWorkspaceAiDataPolicyField();

  return (
    <Section.Root>
      <Section.Header
        title={t`Sharing with IntegraCore`}
        description={t`Choose what IntegraCore can access to support you and improve the product.`}
      />
      <Card.Root>
        <ImpersonationSwitch divider={isIntegraCoreCloud} />
        {isIntegraCoreCloud && (
          <SettingsOptionCardContentSwitch
            Icon={IconChartLine}
            title={t`Help improve IntegraCore`}
            description={t`Share session replays and AI conversations to help us improve IntegraCore`}
            checked={
              getWorkspaceAiDataPolicy(currentWorkspace)
                .isProductImprovementDataSharingEnabled
            }
            onChange={(checked) =>
              updateWorkspaceAiDataPolicyField({
                field: 'isProductImprovementDataSharingEnabled',
                value: checked,
              })
            }
          />
        )}
      </Card.Root>
    </Section.Root>
  );
};
