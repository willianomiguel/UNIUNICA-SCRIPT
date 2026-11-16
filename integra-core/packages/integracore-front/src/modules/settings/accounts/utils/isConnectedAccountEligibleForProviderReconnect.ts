import { type ConnectedAccount } from '@/accounts/types/ConnectedAccount';
import { ConnectedAccountProvider } from 'integracore-shared/types';
import { isDefined } from 'integracore-shared/utils';

export const isConnectedAccountEligibleForProviderReconnect = (
  account: ConnectedAccount,
): boolean =>
  (account.provider === ConnectedAccountProvider.GOOGLE ||
    account.provider === ConnectedAccountProvider.MICROSOFT) &&
  (isDefined(account.authFailedAt) || isDefined(account.archivedAt));
