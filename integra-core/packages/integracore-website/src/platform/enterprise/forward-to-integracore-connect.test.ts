import { getCloudflareContext } from '@opennextjs/cloudflare';

import { forwardToIntegraCoreConnect } from './forward-to-integracore-connect';

jest.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: jest.fn(),
}));

const mockedGetCloudflareContext = getCloudflareContext as jest.Mock;

const buildRequest = () =>
  new Request('https://integracore.com/api/enterprise/validate?trace=1', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ enterpriseKey: 'key' }),
  });

describe('forwardToIntegraCoreConnect', () => {
  const originalForwardingFlag = process.env.INTEGRA_CONNECT_FORWARDING_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.INTEGRA_CONNECT_FORWARDING_ENABLED = 'true';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env.INTEGRA_CONNECT_FORWARDING_ENABLED = originalForwardingFlag;
  });

  it('should forward to the integracore-connect enterprise path with method, headers, query and body', async () => {
    const connectFetch = jest
      .fn()
      .mockResolvedValue(Response.json({ validityToken: 'token' }));
    mockedGetCloudflareContext.mockResolvedValue({
      env: { INTEGRA_CONNECT: { fetch: connectFetch } },
    });

    const response = await forwardToIntegraCoreConnect(buildRequest());

    expect(await response?.json()).toEqual({ validityToken: 'token' });

    expect(connectFetch).toHaveBeenCalledTimes(1);
    expect(mockedGetCloudflareContext).toHaveBeenCalledTimes(1);
    expect(mockedGetCloudflareContext).toHaveBeenCalledWith({ async: true });

    const forwardedRequest: Request = connectFetch.mock.calls[0][0];

    expect(forwardedRequest.url).toBe(
      'https://integracore.com/v1/enterprise/validate?trace=1',
    );
    expect(forwardedRequest.method).toBe('POST');
    expect(forwardedRequest.headers.get('content-type')).toBe(
      'application/json',
    );
    expect(await forwardedRequest.json()).toEqual({ enterpriseKey: 'key' });
  });

  it('should answer locally when forwarding is disabled', async () => {
    process.env.INTEGRA_CONNECT_FORWARDING_ENABLED = 'false';

    await expect(forwardToIntegraCoreConnect(buildRequest())).resolves.toBeNull();
    expect(mockedGetCloudflareContext).not.toHaveBeenCalled();
  });

  it('should answer locally when the binding is missing', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetCloudflareContext.mockResolvedValue({ env: {} });

    await expect(forwardToIntegraCoreConnect(buildRequest())).resolves.toBeNull();
  });

  it('should preserve the raw webhook body and Stripe signature without processing it twice', async () => {
    const rawBody = '{ "type": "checkout.session.completed", "data": "é" }\n';
    const stripeSignature = 't=123,v1=test-signature';
    const connectFetch = jest.fn().mockResolvedValue(new Response('ok'));
    mockedGetCloudflareContext.mockResolvedValue({
      env: { INTEGRA_CONNECT: { fetch: connectFetch } },
    });

    const response = await forwardToIntegraCoreConnect(
      new Request('https://integracore.com/api/enterprise/stripe-webhook', {
        method: 'POST',
        headers: { 'stripe-signature': stripeSignature },
        body: rawBody,
      }),
    );

    expect(await response?.text()).toBe('ok');
    expect(connectFetch).toHaveBeenCalledTimes(1);

    const forwardedRequest: Request = connectFetch.mock.calls[0][0];

    expect(forwardedRequest.url).toBe(
      'https://integracore.com/v1/enterprise/stripe-webhook',
    );
    expect(forwardedRequest.headers.get('stripe-signature')).toBe(
      stripeSignature,
    );
    expect(Buffer.from(await forwardedRequest.arrayBuffer())).toEqual(
      Buffer.from(rawBody),
    );
  });

  it('should leave the body available to the local handler when Cloudflare context fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetCloudflareContext.mockRejectedValue(
      new Error('Context unavailable'),
    );
    const request = buildRequest();

    await expect(forwardToIntegraCoreConnect(request)).resolves.toBeNull();
    expect(await request.json()).toEqual({ enterpriseKey: 'key' });
  });

  it('should propagate forwarding errors without falling through to local processing', async () => {
    const error = new Error('Connect unavailable');
    const connectFetch = jest.fn().mockRejectedValue(error);
    mockedGetCloudflareContext.mockResolvedValue({
      env: { INTEGRA_CONNECT: { fetch: connectFetch } },
    });

    await expect(forwardToIntegraCoreConnect(buildRequest())).rejects.toBe(error);
    expect(connectFetch).toHaveBeenCalledTimes(1);
  });
});
