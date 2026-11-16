import { getOriginFaviconUrl } from '@/settings/security/utils/getOriginFaviconUrl';

describe('getOriginFaviconUrl', () => {
  it('looks up the favicon of a public website', () => {
    expect(
      getOriginFaviconUrl({
        origin: 'https://meet.example.com',
        allowRequestsToIntegraCoreIcons: true,
      }),
    ).toBe('https://integracore-icons.com/meet.example.com');
  });

  it('drops the port from the looked up domain', () => {
    expect(
      getOriginFaviconUrl({
        origin: 'https://meet.example.com:8443',
        allowRequestsToIntegraCoreIcons: true,
      }),
    ).toBe('https://integracore-icons.com/meet.example.com');
  });

  it.each([
    'https://portal.corp.lan',
    'https://nas.home.arpa',
    'https://intranet',
    'http://localhost:3000',
    'http://192.168.1.10',
  ])('keeps the private host %s off integracore-icons', (origin) => {
    expect(
      getOriginFaviconUrl({ origin, allowRequestsToIntegraCoreIcons: true }),
    ).toBeUndefined();
  });

  it('skips every lookup when the instance turns integracore-icons off', () => {
    expect(
      getOriginFaviconUrl({
        origin: 'https://meet.example.com',
        allowRequestsToIntegraCoreIcons: false,
      }),
    ).toBeUndefined();
  });
});
