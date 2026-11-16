import { emailSchema } from 'integracore-shared/utils';

export const isValidEmailRecipientAddress = (address: string): boolean =>
  emailSchema.safeParse(address).success;
