import { updateConfigVariable } from 'test/integration/integracore-config/utils/update-config-variable.util';

export const setEmailVerificationRequired = (value: boolean) =>
  updateConfigVariable({
    input: { key: 'IS_EMAIL_VERIFICATION_REQUIRED', value },
  });
