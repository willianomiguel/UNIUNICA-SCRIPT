import { MetadataApiClient } from 'integracore-client-sdk/metadata';
import { type SendInboxMessageResult } from 'integracore-shared/application';

import { type SendInboxMessageInput } from '@/sdk/define/common/types/loose-shared-types.type';

export const sendInboxMessage = async (
  input: SendInboxMessageInput,
): Promise<SendInboxMessageResult> => {
  const client = new MetadataApiClient();

  const { sendInboxMessage: result } = await client.mutation({
    sendInboxMessage: {
      __args: { input },
      threadId: true,
    },
  });

  return result;
};
