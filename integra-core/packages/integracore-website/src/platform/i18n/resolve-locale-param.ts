import { notFound } from 'next/navigation';
import { type DocumentationSupportedLanguage } from 'integracore-shared/constants';

import { isWebsiteLocale } from './is-website-locale';

export const resolveLocaleParam = (
  raw: string,
): DocumentationSupportedLanguage => {
  if (!isWebsiteLocale(raw)) notFound();
  return raw;
};
