import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'integracore-shared/types';
import { Button } from 'integracore-ui/primitives/input';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const GettingStartedInviteDoneButton = () => {
  const { t } = useLingui();
  const navigateSettings = useNavigateSettings();

  return (
    <Button
      size="sm"
      onClick={() => navigateSettings(SettingsPath.WorkspaceMembersPage)}
    >
      {t`Invite more`}
    </Button>
  );
};
