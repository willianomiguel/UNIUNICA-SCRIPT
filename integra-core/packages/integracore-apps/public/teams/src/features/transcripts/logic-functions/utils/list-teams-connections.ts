import { type AppConnection, listConnections } from 'integracore-sdk/logic-function';

import { TEAMS_PROVIDER_NAMES } from 'src/features/transcripts/constants/teams-provider-names';

export const listTeamsConnections = async (): Promise<AppConnection[]> =>
  (await listConnections()).filter((connection) =>
    TEAMS_PROVIDER_NAMES.includes(connection.providerName),
  );
