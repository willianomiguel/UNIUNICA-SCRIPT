import {
  type ConnectedAccountEmailFields,
  EmailOperation,
} from 'integracore-shared/types';
import { canConnectedAccountPerformEmailOperation } from 'integracore-shared/utils';

export const filterConnectedAccountsAbleToSendEmail = <
  TConnectedAccount extends ConnectedAccountEmailFields,
>(
  connectedAccounts: TConnectedAccount[],
): TConnectedAccount[] =>
  connectedAccounts.filter((connectedAccount) =>
    canConnectedAccountPerformEmailOperation({
      connectedAccount,
      operation: EmailOperation.SEND,
    }),
  );
