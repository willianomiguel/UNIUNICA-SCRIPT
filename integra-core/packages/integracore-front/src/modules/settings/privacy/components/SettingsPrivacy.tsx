import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { SettingsPrivacyAiDataProcessing } from '@/settings/privacy/components/SettingsPrivacyAiDataProcessing';
import { SettingsPrivacySafeguards } from '@/settings/privacy/components/SettingsPrivacySafeguards';
import { SettingsPrivacySharingWithIntegraCore } from '@/settings/privacy/components/SettingsPrivacySharingWithIntegraCore';
import { useIsAiDataPolicyConfigurable } from '@/settings/privacy/hooks/useIsAiDataPolicyConfigurable';
import { useIsIntegraCoreCloud } from '@/settings/privacy/hooks/useIsIntegraCoreCloud';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const SettingsPrivacy = () => {
  const isIntegraCoreCloud = useIsIntegraCoreCloud();
  const isAiDataPolicyConfigurable = useIsAiDataPolicyConfigurable();
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  return (
    <>
      {isIntegraCoreCloud && <SettingsPrivacySafeguards />}
      {isAiDataPolicyConfigurable && <SettingsPrivacyAiDataProcessing />}
      {isMultiWorkspaceEnabled && <SettingsPrivacySharingWithIntegraCore />}
    </>
  );
};
