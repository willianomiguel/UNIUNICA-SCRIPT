import { normalizeDomain } from '@/utils/url/normalizeDomain';

describe('normalizeDomain', () => {
  it.each([
    'integracore.com',
    'TWENTY.com',
    'www.integracore.com',
    'https://integracore.com',
    'https://www.integracore.com/',
    'http://www.IntegraCore.com/careers?utm=1#team',
    '  https://integracore.com  ',
    'integracore.com.',
    'integracore.com:8080',
    'https://user:secret@www.integracore.com',
    'ftp://integracore.com',
  ])('should reduce %s to the bare domain', (rawDomain) => {
    expect(normalizeDomain(rawDomain)).toBe('integracore.com');
  });

  it('should keep subdomains other than www', () => {
    expect(normalizeDomain('https://blog.integracore.com')).toBe('blog.integracore.com');
  });

  it('should fold an internationalized domain onto its punycode spelling', () => {
    expect(normalizeDomain('münchen.de')).toBe('xn--mnchen-3ya.de');
    expect(normalizeDomain('https://München.de')).toBe('xn--mnchen-3ya.de');
    expect(normalizeDomain('xn--mnchen-3ya.de')).toBe('xn--mnchen-3ya.de');
  });

  it('should read a backslash as a path separator, like a browser does', () => {
    expect(normalizeDomain('integracore.com\\@evil.com')).toBe('integracore.com');
    expect(normalizeDomain('https://integracore.com\\evil.com/x')).toBe(
      'integracore.com',
    );
  });

  it('should drop every user info segment', () => {
    expect(normalizeDomain('https://a@b@integracore.com')).toBe('integracore.com');
  });

  it('should strip every repeated www label and trailing dot in one pass', () => {
    expect(normalizeDomain('www.www.integracore.com')).toBe('integracore.com');
    expect(normalizeDomain('integracore.com..')).toBe('integracore.com');
  });

  it.each([
    'integracore.com',
    'https://www.integracore.com/careers?x=1',
    'www.www.integracore.com',
    'integracore.com..',
    'münchen.de',
    'not a domain',
    '',
  ])('should already be normalized after one pass for %s', (rawDomain) => {
    const normalized = normalizeDomain(rawDomain);

    expect(normalizeDomain(normalized)).toBe(normalized);
  });

  it('should return an empty string for an empty value', () => {
    expect(normalizeDomain('')).toBe('');
  });

  it('should hand back something unparseable rather than throwing', () => {
    expect(normalizeDomain('not a domain')).toBe('not a domain');
  });
});
