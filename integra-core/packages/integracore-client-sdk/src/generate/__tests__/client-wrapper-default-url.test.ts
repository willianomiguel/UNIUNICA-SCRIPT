import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createJsonResponse,
  loadGeneratedClientClass,
} from './generated-client-test-helpers';

const queryDefaultUrl = async () => {
  const { GeneratedClientClass, cleanup } = await loadGeneratedClientClass();
  const fetchMock = vi.fn<typeof globalThis.fetch>(async () =>
    createJsonResponse({ body: { data: { record: { id: 'record-id' } } } }),
  );

  try {
    await new GeneratedClientClass({ fetch: fetchMock }).query({
      record: { id: true },
    });
  } finally {
    await cleanup();
  }

  expect(fetchMock).toHaveBeenCalledTimes(1);

  return fetchMock.mock.calls[0]?.[0];
};

describe('Generated client default url', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('calls the internal API url when the runtime provides one', async () => {
    vi.stubEnv('INTEGRA_API_URL', 'https://api.example.com');
    vi.stubEnv('INTEGRA_INTERNAL_API_URL', 'http://integracore-server:3000');
    vi.stubEnv('INTEGRA_APP_ACCESS_TOKEN', 'token');

    expect(await queryDefaultUrl()).toBe('http://integracore-server:3000/metadata');
  });

  it('falls back to the public API url', async () => {
    vi.stubEnv('INTEGRA_API_URL', 'https://api.example.com');
    vi.stubEnv('INTEGRA_INTERNAL_API_URL', '');
    vi.stubEnv('INTEGRA_APP_ACCESS_TOKEN', 'token');

    expect(await queryDefaultUrl()).toBe('https://api.example.com/metadata');
  });
});
