import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  setup,
  teardown,
} from '../../../app-template/example/files/src/__tests__/global-setup';
import { runIntegraCore } from '../../../app-template/example/files/src/__tests__/run-integracore';

vi.mock('../../../app-template/example/files/src/__tests__/run-integracore', () => ({
  runIntegraCore: vi.fn(),
}));

const notInstalled = {
  ok: false,
  error: { code: 'APP_NOT_INSTALLED', message: 'Not installed.' },
} as const;

const uninstallFailed = {
  ok: false,
  error: { code: 'PERMISSION_DENIED', message: 'Cannot uninstall.' },
} as const;

describe('app template integration setup', () => {
  beforeEach(() => {
    vi.mocked(runIntegraCore).mockReset();
    vi.stubEnv('INTEGRA_API_URL', 'http://localhost:2020');
    vi.stubEnv('INTEGRA_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('installs the app when there is no previous installation to clean up', async () => {
    vi.mocked(runIntegraCore)
      .mockResolvedValueOnce(notInstalled)
      .mockResolvedValueOnce({ ok: true, data: {} });

    await setup();

    expect(runIntegraCore).toHaveBeenNthCalledWith(1, ['app', 'uninstall', '--yes']);
    expect(runIntegraCore).toHaveBeenNthCalledWith(2, ['app', 'apply', '--create']);
  });

  it('reports an unreachable server before running app commands', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Connection refused'));

    await expect(setup()).rejects.toThrow(
      'IntegraCore server is not reachable at http://localhost:2020.',
    );
    expect(runIntegraCore).not.toHaveBeenCalled();
  });

  it('preserves HTTP health-check failures before running app commands', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));

    await expect(setup()).rejects.toThrow(
      'Server at http://localhost:2020 returned 503',
    );
    expect(runIntegraCore).not.toHaveBeenCalled();
  });

  it('does not apply the app when cleanup fails', async () => {
    vi.mocked(runIntegraCore).mockResolvedValue(uninstallFailed);

    await expect(setup()).rejects.toThrow(
      'PERMISSION_DENIED Cannot uninstall.',
    );
    expect(runIntegraCore).toHaveBeenCalledExactlyOnceWith([
      'app',
      'uninstall',
      '--yes',
    ]);
  });

  it('surfaces uninstall failures during teardown', async () => {
    vi.mocked(runIntegraCore).mockResolvedValue(uninstallFailed);

    await expect(teardown()).rejects.toThrow(
      'PERMISSION_DENIED Cannot uninstall.',
    );
  });

  it('allows teardown after the app was already uninstalled', async () => {
    vi.mocked(runIntegraCore).mockResolvedValue(notInstalled);

    await expect(teardown()).resolves.toBeUndefined();
  });
});
