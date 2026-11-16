import { PermissionIcon } from '@/settings/roles/role-permissions/objects-permissions/components/PermissionIcon';
import { type SettingsRoleObjectPermissionKey } from '@/settings/roles/role-permissions/objects-permissions/constants/SettingsRoleObjectPermissionIconConfig';
import { isDefined } from 'integracore-shared/utils';
import { LightIconButton } from 'integracore-ui/components/input';
import { ListItemButton } from 'integracore-ui/components/navigation';
import { ListItem } from 'integracore-ui/primitives/navigation';
import { IconTrash } from 'integracore-ui/icon';
import { useLingui } from '@lingui/react/macro';

type WorkflowAiAgentPermissionsPermissionRowProps = {
  permission: {
    key: SettingsRoleObjectPermissionKey;
    label: string;
  };
  isEnabled: boolean;
  readonly: boolean;
  shouldShowDeleteButton?: boolean;
  alwaysShowGranted?: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
};

export const WorkflowAiAgentPermissionsPermissionRow = ({
  permission,
  isEnabled,
  readonly,
  shouldShowDeleteButton = true,
  alwaysShowGranted = false,
  onAdd,
  onDelete,
}: WorkflowAiAgentPermissionsPermissionRowProps) => {
  const { t } = useLingui();
  const isClickable = !readonly && !isEnabled && isDefined(onAdd);
  const isDisabled = isEnabled && !shouldShowDeleteButton;
  const shouldShowTrashButton = isEnabled && shouldShowDeleteButton;

  const startIcon = (
    <PermissionIcon
      permission={permission.key}
      state={alwaysShowGranted || isEnabled ? 'granted' : 'revoked'}
    />
  );

  if (isClickable) {
    return (
      <ListItemButton startIcon={startIcon} onClick={onAdd}>
        {permission.label}
      </ListItemButton>
    );
  }

  return (
    <ListItem
      startIcon={startIcon}
      disabled={isDisabled}
      actions={
        shouldShowTrashButton && (
          <LightIconButton aria-label={t`Remove permission`} onClick={onDelete}>
            <IconTrash />
          </LightIconButton>
        )
      }
    >
      {permission.label}
    </ListItem>
  );
};
