import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Test } from '@nestjs/testing';

import { IntegraCoreConfigService } from 'src/engine/core-modules/integracore-config/integracore-config.service';
import { CloudflareSecretMatchGuard } from 'src/engine/core-modules/cloudflare/guards/cloudflare-secret.guard';

const buildMockContext = (headers: Record<string, unknown>) =>
  new ExecutionContextHost([{ headers }]);

describe('CloudflareSecretMatchGuard.canActivate', () => {
  let guard: CloudflareSecretMatchGuard;
  let integracoreConfigService: IntegraCoreConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CloudflareSecretMatchGuard,
        { provide: IntegraCoreConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    guard = module.get(CloudflareSecretMatchGuard);
    integracoreConfigService = module.get(IntegraCoreConfigService);
  });

  it('should return true when the webhook secret matches', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue('valid-secret');

    const context = buildMockContext({
      'cf-webhook-auth': 'valid-secret',
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw InternalServerErrorException when env is not set', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue(undefined);

    const context = buildMockContext({
      'cf-webhook-auth': 'any-value',
    });

    expect(() => guard.canActivate(context)).toThrow(
      'CLOUDFLARE_WEBHOOK_SECRET is not configured',
    );
  });

  it('should return false when the header is missing', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue('valid-secret');

    const context = buildMockContext({});

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false when the header value is wrong', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue('valid-secret');

    const context = buildMockContext({
      'cf-webhook-auth': 'wrong-secret',
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false when the header is an empty string', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue('valid-secret');

    const context = buildMockContext({
      'cf-webhook-auth': '',
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false when header length differs from secret', () => {
    jest.spyOn(integracoreConfigService, 'get').mockReturnValue('short');

    const context = buildMockContext({
      'cf-webhook-auth': 'much-longer-value',
    });

    expect(guard.canActivate(context)).toBe(false);
  });
});
