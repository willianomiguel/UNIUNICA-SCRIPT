import {
  type ConnectedAccountEmailFields,
  EmailOperation,
} from 'integracore-shared/types';
import { canConnectedAccountPerformEmailOperation } from 'integracore-shared/utils';

export const findFirstConnectedAccountAbleToSendEmail = <
  TConnectedAccount extends ConnectedAccountEmailFields,
>(
  connectedAccounts: TConnectedAccount[],
): TConnectedAccount | null =>
  connectedAccounts.find((connectedAccount) =>
    canConnectedAccountPerformEmailOperation({
      connectedAccount,
      operation: EmailOperation.SEND,
    }),
  ) ?? null;
