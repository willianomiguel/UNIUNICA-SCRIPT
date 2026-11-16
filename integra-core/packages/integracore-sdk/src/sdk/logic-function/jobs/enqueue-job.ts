import { MetadataApiClient } from 'integracore-client-sdk/metadata';
import {
  type EnqueueJobInput,
  type EnqueueJobResult,
} from 'integracore-shared/application';

/**
 * @deprecated Use `enqueueJobs` instead.
 */
export const enqueueJob = async (
  input: EnqueueJobInput,
): Promise<EnqueueJobResult> => {
  const client = new MetadataApiClient();

  const { enqueueJob: result } = await client.mutation({
    enqueueJob: {
      __args: { input },
      enqueued: true,
      logicFunctionUniversalIdentifier: true,
      jobId: true,
    },
  });

  return result;
};
