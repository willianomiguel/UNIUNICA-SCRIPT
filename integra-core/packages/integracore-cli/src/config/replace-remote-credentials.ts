import { isDefined } from 'integracore-shared/utils';

import { type RemoteEntry } from '@/config/types/config-file.type';
import { type RemoteCredentials } from '@/config/types/remote-credentials.type';

export const replaceRemoteCredentials = ({
  remote,
  credentials,
}: {
  remote: RemoteEntry;
  credentials: RemoteCredentials;
}): RemoteEntry => {
  const {
    apiKey: _apiKey,
    integracoreCLIAccessToken: _accessToken,
    integracoreCLIRefreshToken: _refreshToken,
    integracoreCLIRegistrationClientId: _clientId,
    ...preservedFields
  } = remote;

  return {
    ...preservedFields,
    ...(credentials.kind === 'apiKey'
      ? { apiKey: credentials.apiKey }
      : {
          integracoreCLIAccessToken: credentials.accessToken,
          integracoreCLIRegistrationClientId: credentials.clientId,
          ...(isDefined(credentials.refreshToken)
            ? { integracoreCLIRefreshToken: credentials.refreshToken }
            : {}),
        }),
  };
};
