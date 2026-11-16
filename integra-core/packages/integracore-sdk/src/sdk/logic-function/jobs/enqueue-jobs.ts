import { MetadataApiClient } from 'integracore-client-sdk/metadata';
import {
  type EnqueueJobsInput,
  type EnqueueJobsResult,
} from 'integracore-shared/application';

export const enqueueJobs = async (
  input: EnqueueJobsInput,
): Promise<EnqueueJobsResult> => {
  const client = new MetadataApiClient();

  const { enqueueJobs: result } = await client.mutation({
    enqueueJobs: {
      __args: { input },
      enqueued: true,
      logicFunctionUniversalIdentifier: true,
      enqueuedJobsCount: true,
      jobIds: true,
      jobs: { jobId: true, sizeBytes: true },
      availableBytes: true,
    },
  });

  return result;
};
