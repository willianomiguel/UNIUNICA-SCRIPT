import { WebhookSubscriptionChannelType } from 'integracore-shared/types';

export type WebhookSubscriptionChannelReference = {
  channelType: WebhookSubscriptionChannelType;
  channelId: string;
  workspaceId: string;
};
