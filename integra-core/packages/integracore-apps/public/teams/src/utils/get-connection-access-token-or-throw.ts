import { type AppConnection } from 'integracore-sdk/logic-function';
import { isDefined } from 'integracore-sdk/utils';

export const getConnectionAccessTokenOrThrow = (
  connection: Pick<AppConnection, 'id' | 'accessToken'>,
): string => {
  if (!isDefined(connection.accessToken)) {
    throw new Error(`Connection ${connection.id} has no access token`);
  }

  return connection.accessToken;
};
