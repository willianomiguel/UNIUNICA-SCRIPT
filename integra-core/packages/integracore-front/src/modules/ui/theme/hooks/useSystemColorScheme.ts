import { useMediaQuery } from 'integracore-ui/utilities';
import { type ColorScheme } from '@/ui/theme/types/ColorScheme';
import { doNotTranslate } from 'integracore-shared/i18n';

export const useSystemColorScheme = (): ColorScheme =>
  useMediaQuery(doNotTranslate('(prefers-color-scheme: dark)'))
    ? doNotTranslate('Dark')
    : doNotTranslate('Light');
