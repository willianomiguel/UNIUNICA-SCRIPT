import { billingState } from '@/client-config/states/billingState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

// self-hosters can enable multi-workspace mode, but not IntegraCore's billing, so both together mean IntegraCore Cloud
export const useIsIntegraCoreCloud = () => {
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const billing = useAtomStateValue(billingState);

  return isMultiWorkspaceEnabled && (billing?.isBillingEnabled ?? false);
};
