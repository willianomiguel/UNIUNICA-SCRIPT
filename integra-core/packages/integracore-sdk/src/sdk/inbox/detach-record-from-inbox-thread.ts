import { MetadataApiClient } from 'integracore-client-sdk/metadata';
import { type InboxThreadRecordInput } from 'integracore-shared/application';

export const detachRecordFromInboxThread = async (
  input: InboxThreadRecordInput,
): Promise<void> => {
  const client = new MetadataApiClient();

  await client.mutation({
    detachRecordFromInboxThread: { __args: { input } },
  });
};
