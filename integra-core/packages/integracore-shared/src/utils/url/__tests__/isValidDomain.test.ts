import { isValidDomain } from '@/utils/url/isValidDomain';

describe('isValidDomain', () => {
  it.each([
    'integracore.com',
    'https://www.integracore.com/careers?x=1',
    'blog.integracore.com',
    'integracore.co.uk',
    'münchen.de',
    'integracore.com.',
    'integracore.com:8080',
  ])('should accept %s', (rawDomain) => {
    expect(isValidDomain(rawDomain)).toBe(true);
  });

  it.each([
    'not a domain',
    'integracore',
    'javascript:alert(1)',
    '<script>',
    'localhost',
    '192.168.1.1',
    '',
  ])('should reject %s', (rawDomain) => {
    expect(isValidDomain(rawDomain)).toBe(false);
  });

  it('should judge a backslash host the way a browser reads it', () => {
    expect(isValidDomain('integracore.com\\@evil.com')).toBe(true);
    expect(isValidDomain('integracore.com\\@not a domain')).toBe(true);
  });
});
