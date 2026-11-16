import { getSubdomainAndCustomDomainFromHostname } from 'src/engine/core-modules/domain/domain-server-config/utils/get-subdomain-and-custom-domain-from-hostname.util';

describe('getSubdomainAndCustomDomainFromHostname', () => {
  const config = {
    frontDomain: 'integracore.com',
    publicBaseDomain: 'withintegracore.com',
    defaultSubdomain: 'app',
  };

  it.each([
    {
      case: 'the front host',
      hostname: 'integracore.com',
      expected: {
        subdomain: undefined,
        customDomain: null,
        isUnderPublicDomainUrl: false,
      },
    },
    {
      case: 'a workspace subdomain',
      hostname: 'acme.integracore.com',
      expected: {
        subdomain: 'acme',
        customDomain: null,
        isUnderPublicDomainUrl: false,
      },
    },
    {
      case: 'the default subdomain',
      hostname: 'app.integracore.com',
      expected: {
        subdomain: undefined,
        customDomain: null,
        isUnderPublicDomainUrl: false,
      },
    },
    {
      case: 'a public domain host',
      hostname: 'acme.withintegracore.com',
      expected: {
        subdomain: 'acme',
        customDomain: null,
        isUnderPublicDomainUrl: true,
      },
    },
    {
      case: 'a custom domain',
      hostname: 'crm.acme.com',
      expected: {
        subdomain: undefined,
        customDomain: 'crm.acme.com',
        isUnderPublicDomainUrl: false,
      },
    },
  ])('should resolve $case', ({ hostname, expected }) => {
    expect(
      getSubdomainAndCustomDomainFromHostname({ ...config, hostname }),
    ).toEqual(expected);
  });

  it('should resolve the front host as the front domain when it sits under the public domain', () => {
    expect(
      getSubdomainAndCustomDomainFromHostname({
        hostname: 'integracore.example.com',
        frontDomain: 'integracore.example.com',
        publicBaseDomain: 'example.com',
        defaultSubdomain: 'app',
      }),
    ).toEqual({
      subdomain: undefined,
      customDomain: null,
      isUnderPublicDomainUrl: false,
    });
  });

  it('should resolve workspace subdomains of a front host under the public domain', () => {
    expect(
      getSubdomainAndCustomDomainFromHostname({
        hostname: 'acme.integracore.example.com',
        frontDomain: 'integracore.example.com',
        publicBaseDomain: 'example.com',
        defaultSubdomain: 'app',
      }),
    ).toEqual({
      subdomain: 'acme',
      customDomain: null,
      isUnderPublicDomainUrl: false,
    });
  });

  it('should not treat hosts as public domains when no public domain is configured', () => {
    expect(
      getSubdomainAndCustomDomainFromHostname({
        hostname: 'acme.withintegracore.com',
        frontDomain: 'integracore.com',
        defaultSubdomain: 'app',
      }),
    ).toEqual({
      subdomain: undefined,
      customDomain: 'acme.withintegracore.com',
      isUnderPublicDomainUrl: false,
    });
  });
});
