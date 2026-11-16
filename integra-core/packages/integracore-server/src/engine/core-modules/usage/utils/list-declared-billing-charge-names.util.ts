import { type ApplicationBilling } from 'integracore-shared/application';

export const listDeclaredBillingChargeNames = ({
  billing,
}: {
  billing:
    | Pick<ApplicationBilling, 'recurring' | 'operations'>
    | null
    | undefined;
}): string[] => [
  ...Object.keys(billing?.recurring ?? {}),
  ...Object.keys(billing?.operations ?? {}),
];
