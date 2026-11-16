import { type ApplicationBilling } from 'integracore-shared/application';
import { isDefined } from 'integracore-shared/utils';

export const doesApplicationBillCredits = (
  billing: ApplicationBilling | undefined,
): boolean =>
  Object.values(billing?.operations ?? {}).some(isDefined) ||
  Object.values(billing?.recurring ?? {}).some(isDefined);
