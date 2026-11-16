import { type getCreditAvailability } from 'integracore-sdk/billing';

// integracore-sdk/billing does not export its verdict types.
export type CreditUnavailableReason = Extract<
  Awaited<ReturnType<typeof getCreditAvailability>>,
  { hasAvailableCredits: false }
>['reason'];
