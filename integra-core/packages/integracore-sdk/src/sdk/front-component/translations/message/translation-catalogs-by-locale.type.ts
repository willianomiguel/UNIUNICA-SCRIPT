import { type AppLocale } from 'integracore-shared/translations';

export type TranslationCatalogsByLocale = Partial<
  Record<AppLocale, Record<string, string>>
>;
