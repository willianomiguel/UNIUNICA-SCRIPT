import { PermissionFlagType } from 'integracore-shared/constants';
import { ConnectedAccountProvider } from 'integracore-shared/types';

export const getConnectedAccountAdministrationPermissionFlag = (
  provider: ConnectedAccountProvider,
): PermissionFlagType =>
  provider === ConnectedAccountProvider.APP
    ? PermissionFlagType.APPLICATIONS
    : PermissionFlagType.WORKSPACE;
