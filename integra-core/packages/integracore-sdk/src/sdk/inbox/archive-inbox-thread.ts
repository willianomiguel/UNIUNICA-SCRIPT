import { MetadataApiClient } from 'integracore-client-sdk/metadata';
import { type ArchiveInboxThreadInput } from 'integracore-shared/application';

export const archiveInboxThread = async (
  input: ArchiveInboxThreadInput,
): Promise<void> => {
  const client = new MetadataApiClient();

  await client.mutation({
    archiveInboxThread: { __args: { input } },
  });
};
