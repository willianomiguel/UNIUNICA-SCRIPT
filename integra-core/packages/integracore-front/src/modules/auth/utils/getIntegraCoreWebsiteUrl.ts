import {
  DOCUMENTATION_DEFAULT_LANGUAGE,
  DOCUMENTATION_SUPPORTED_LANGUAGES,
  type DocumentationSupportedLanguage,
} from 'integracore-shared/constants';

const INTEGRA_WEBSITE_HREF = 'https://integracore.com';

type IntegraCoreWebsitePage = 'terms' | 'privacy-policy';

export const getIntegraCoreWebsiteUrl = (
  locale: string,
  page: IntegraCoreWebsitePage,
): string => {
  const language = new Intl.Locale(locale).language;

  const isLocalizedWebsitePath =
    language !== DOCUMENTATION_DEFAULT_LANGUAGE &&
    DOCUMENTATION_SUPPORTED_LANGUAGES.some(
      (supportedLanguage: DocumentationSupportedLanguage) =>
        supportedLanguage === language,
    );

  const url = new URL(
    isLocalizedWebsitePath ? `/${language}/${page}` : `/${page}`,
    INTEGRA_WEBSITE_HREF,
  );

  return url.toString();
};
