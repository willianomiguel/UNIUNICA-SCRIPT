import { getIntegraCoreWebsiteUrl } from '@/auth/utils/getIntegraCoreWebsiteUrl';

describe('getIntegraCoreWebsiteUrl', () => {
  it.each([
    ['ar-SA', 'ar'],
    ['cs-CZ', 'cs'],
    ['de-DE', 'de'],
    ['es-ES', 'es'],
    ['fr-FR', 'fr'],
    ['it-IT', 'it'],
    ['ja-JP', 'ja'],
    ['ko-KR', 'ko'],
    ['pt-BR', 'pt'],
    ['pt-PT', 'pt'],
    ['ro-RO', 'ro'],
    ['ru-RU', 'ru'],
    ['tr-TR', 'tr'],
    ['zh-CN', 'zh'],
    ['zh-TW', 'zh'],
  ])('uses the localized IntegraCore website path for %s', (locale, language) => {
    expect(getIntegraCoreWebsiteUrl(locale, 'privacy-policy')).toBe(
      `https://integracore.com/${language}/privacy-policy`,
    );
  });

  it('uses the default IntegraCore website path for English', () => {
    expect(getIntegraCoreWebsiteUrl('en', 'terms')).toBe('https://integracore.com/terms');
  });

  it('uses English for the pseudo locale', () => {
    expect(getIntegraCoreWebsiteUrl('pseudo-en', 'terms')).toBe(
      'https://integracore.com/terms',
    );
  });
});
