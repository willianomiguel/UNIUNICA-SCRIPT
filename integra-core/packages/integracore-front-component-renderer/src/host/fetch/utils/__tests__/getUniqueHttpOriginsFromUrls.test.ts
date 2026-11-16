import { getUniqueHttpOriginsFromUrls } from '../getUniqueHttpOriginsFromUrls';

describe('getUniqueHttpOriginsFromUrls', () => {
  it('should reduce urls to their origins', () => {
    expect(
      getUniqueHttpOriginsFromUrls([
        'https://api.integracore.test/graphql',
        'http://functions.integracore.test/base/path',
      ]),
    ).toEqual(['https://api.integracore.test', 'http://functions.integracore.test']);
  });

  it('should deduplicate identical origins', () => {
    expect(
      getUniqueHttpOriginsFromUrls([
        'https://api.integracore.test/graphql',
        'https://api.integracore.test/rest/front-components/id',
      ]),
    ).toEqual(['https://api.integracore.test']);
  });

  it('should drop undefined urls', () => {
    expect(
      getUniqueHttpOriginsFromUrls([undefined, 'https://api.integracore.test']),
    ).toEqual(['https://api.integracore.test']);
  });

  it('should drop malformed urls', () => {
    expect(
      getUniqueHttpOriginsFromUrls(['not a url', 'https://api.integracore.test']),
    ).toEqual(['https://api.integracore.test']);
  });

  it('should drop urls with non http schemes', () => {
    expect(
      getUniqueHttpOriginsFromUrls([
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd',
        'blob:https://api.integracore.test/id',
        'https://api.integracore.test',
      ]),
    ).toEqual(['https://api.integracore.test']);
  });
});
