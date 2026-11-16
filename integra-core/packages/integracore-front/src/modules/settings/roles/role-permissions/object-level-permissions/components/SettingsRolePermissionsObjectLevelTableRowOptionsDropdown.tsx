import { useResetObjectPermission } from '@/settings/roles/role-permissions/object-level-permissions/hooks/useResetObjectPermission';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownRoot } from '@/ui/layout/dropdown/components/DropdownRoot';
import { Link } from 'react-router-dom';
import { IconButton } from 'integracore-ui/components/input';
import { Dropdown } from 'integracore-ui/components/navigation';
import { IconDotsVertical, IconPencil, IconTrash } from 'integracore-ui/icon';
import { useLingui } from '@lingui/react/macro';

type SettingsRolePermissionsObjectLevelTableRowOptionsDropdownProps = {
  roleId: string;
  objectMetadataId: string;
  objectPermissionDetailUrl: string;
  isEditable: boolean;
};

export const SettingsRolePermissionsObjectLevelTableRowOptionsDropdown = ({
  roleId,
  objectMetadataId,
  objectPermissionDetailUrl,
  isEditable,
}: SettingsRolePermissionsObjectLevelTableRowOptionsDropdownProps) => {
  const { t } = useLingui();
  const dropdownId = `settings-role-object-level-options-${objectMetadataId}`;

  const { resetObjectPermission } = useResetObjectPermission(roleId);

  return (
    <DropdownRoot dropdownId={dropdownId} type="menu">
      <Dropdown.Trigger
        render={
          <IconButton
            aria-label={t`Object permission options`}
            variant="ghost"
            size="sm"
          >
            <IconDotsVertical />
          </IconButton>
        }
      />
      <DropdownContent align="end">
        <Dropdown.Section>
          {isEditable && (
            <Dropdown.ActionItem
              startIcon={<IconPencil />}
              render={<Link to={objectPermissionDetailUrl} />}
            >{t`Edit`}</Dropdown.ActionItem>
          )}
          <Dropdown.ActionItem
            startIcon={<IconTrash />}
            color="danger"
            onClick={() => resetObjectPermission(objectMetadataId)}
          >{t`Remove rule`}</Dropdown.ActionItem>
        </Dropdown.Section>
      </DropdownContent>
    </DropdownRoot>
  );
};
