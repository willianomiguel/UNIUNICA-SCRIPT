import { WebhookSubscriptionStatus } from 'integracore-shared/types';

export const REVOCABLE_WEBHOOK_SUBSCRIPTION_STATUSES: WebhookSubscriptionStatus[] =
  [
    WebhookSubscriptionStatus.ACTIVE,
    WebhookSubscriptionStatus.FAILED,
    WebhookSubscriptionStatus.EXPIRED,
    WebhookSubscriptionStatus.PENDING,
  ];
