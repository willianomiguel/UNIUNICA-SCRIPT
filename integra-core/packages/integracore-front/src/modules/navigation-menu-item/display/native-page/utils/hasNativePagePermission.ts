import { type PermissionFlagType } from 'integracore-shared/constants';
import { isDefined } from 'integracore-shared/utils';

import { getNativePageNavigationMenuItemConfig } from '@/navigation-menu-item/display/native-page/utils/getNativePageNavigationMenuItemConfig';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const hasNativePagePermission = ({
  item,
  permissionFlagMap,
}: {
  item: Pick<NavigationMenuItem, 'nativePageKey'>;
  permissionFlagMap: Partial<Record<PermissionFlagType, boolean>>;
}): boolean => {
  const requiredPermissionFlag =
    getNativePageNavigationMenuItemConfig(item)?.requiredPermissionFlag;

  return (
    !isDefined(requiredPermissionFlag) ||
    (permissionFlagMap[requiredPermissionFlag] ?? false)
  );
};
