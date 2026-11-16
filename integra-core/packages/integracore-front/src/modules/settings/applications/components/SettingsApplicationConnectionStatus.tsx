import { type ConnectedAccount } from '@/accounts/types/ConnectedAccount';
import { SettingsSyncFailedStatus } from '@/settings/applications/components/SettingsSyncFailedStatus';
import { isApplicationConnectionReconnectNeeded } from '@/settings/applications/utils/isApplicationConnectionReconnectNeeded';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'integracore-shared/utils';
import { Status } from 'integracore-ui/primitives/data-display';

type SettingsApplicationConnectionStatusProps = {
  connection: Partial<Pick<ConnectedAccount, 'authFailedAt' | 'archivedAt'>>;
};

export const SettingsApplicationConnectionStatus = ({
  connection,
}: SettingsApplicationConnectionStatusProps) => {
  const { t } = useLingui();

  if (isDefined(connection.archivedAt)) {
    return <Status color="gray" weight="medium">{t`Disconnected`}</Status>;
  }

  return isApplicationConnectionReconnectNeeded(connection) ? (
    <SettingsSyncFailedStatus />
  ) : (
    <Status color="green" weight="medium">{t`Connected`}</Status>
  );
};
