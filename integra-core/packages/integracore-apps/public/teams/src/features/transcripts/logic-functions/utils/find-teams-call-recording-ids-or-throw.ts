import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'integracore-client-sdk/core';

import { INTEGRA_QUERY_MAX_RECORDS } from 'src/features/transcripts/logic-functions/constants/integracore-query-max-records';
import { chunkIntoBatches } from 'src/features/transcripts/logic-functions/utils/chunk-into-batches';

export const findTeamsCallRecordingIdsOrThrow = async ({
  coreApiClient,
  callRecordingIds,
}: {
  coreApiClient: Pick<CoreApiClient, 'query'>;
  callRecordingIds: string[];
}): Promise<string[]> => {
  const applicationId = process.env.APPLICATION_ID;

  if (!isNonEmptyString(applicationId)) {
    return [];
  }

  const teamsCallRecordingIds: string[] = [];

  for (const batch of chunkIntoBatches(
    callRecordingIds,
    INTEGRA_QUERY_MAX_RECORDS,
  )) {
    const queryResult: {
      callRecordings?: { edges?: { node: { id: string } }[] };
    } = await coreApiClient.query({
      callRecordings: {
        __args: {
          filter: {
            id: { in: batch },
            applicationId: { eq: applicationId },
          },
          first: INTEGRA_QUERY_MAX_RECORDS,
        },
        edges: { node: { id: true } },
      },
    });

    teamsCallRecordingIds.push(
      ...(queryResult.callRecordings?.edges?.map(({ node }) => node.id) ?? []),
    );
  }

  return teamsCallRecordingIds;
};
