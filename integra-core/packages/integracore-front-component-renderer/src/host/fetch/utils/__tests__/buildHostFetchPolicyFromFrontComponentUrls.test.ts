import { buildHostFetchPolicyFromFrontComponentUrls } from '../buildHostFetchPolicyFromFrontComponentUrls';

describe('buildHostFetchPolicyFromFrontComponentUrls', () => {
  it('should derive allowed origins from the api, functions and component urls', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl:
        'https://components.integracore.test/rest/front-components/component-id',
      apiUrl: 'https://api.integracore.test/graphql',
      functionsBaseUrl: 'https://functions.integracore.test/base',
    });

    expect(hostFetchPolicy.allowedOrigins).toEqual([
      'https://api.integracore.test',
      'https://functions.integracore.test',
      'https://components.integracore.test',
    ]);
  });

  it('should drop undefined urls', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
    });

    expect(hostFetchPolicy.allowedOrigins).toEqual(['https://api.integracore.test']);
  });

  it('should drop malformed urls', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
      apiUrl: 'not a url',
    });

    expect(hostFetchPolicy.allowedOrigins).toEqual(['https://api.integracore.test']);
  });

  it('should drop urls with non http schemes', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
      apiUrl: 'data:text/html,<script>alert(1)</script>',
      functionsBaseUrl: 'file:///etc/passwd',
    });

    expect(hostFetchPolicy.allowedOrigins).toEqual(['https://api.integracore.test']);
  });

  it('should deduplicate identical origins', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
      apiUrl: 'https://api.integracore.test/graphql',
      functionsBaseUrl: 'https://api.integracore.test/functions',
    });

    expect(hostFetchPolicy.allowedOrigins).toEqual(['https://api.integracore.test']);
  });

  it('should mark the component and sdk client urls as file storage redirectable', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
      sdkClientUrls: {
        core: 'https://api.integracore.test/sdk-client/application-id/core',
        metadata: 'https://api.integracore.test/sdk-client/application-id/metadata',
      },
    });

    expect(hostFetchPolicy.fileStorageRedirectableUrls).toEqual([
      'https://api.integracore.test/rest/front-components/id',
      'https://api.integracore.test/sdk-client/application-id/core',
      'https://api.integracore.test/sdk-client/application-id/metadata',
    ]);
  });

  it('should mark only the component url as redirectable when sdk client urls are undefined', () => {
    const hostFetchPolicy = buildHostFetchPolicyFromFrontComponentUrls({
      componentUrl: 'https://api.integracore.test/rest/front-components/id',
    });

    expect(hostFetchPolicy.fileStorageRedirectableUrls).toEqual([
      'https://api.integracore.test/rest/front-components/id',
    ]);
  });
});
