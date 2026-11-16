import { doNotTranslate } from 'integracore-shared/i18n';

export const detectTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return doNotTranslate('UTC');
  }
};
