import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { useIsMobile } from 'integracore-ui/utilities';
import { PermissionFlagType } from '~/generated-metadata/graphql';

export const useIsLogConsoleAllowed = () => {
  const hasSecurityPermission = useHasPermissionFlag(
    PermissionFlagType.SECURITY,
  );
  const isMobile = useIsMobile();

  return hasSecurityPermission && !isMobile;
};
