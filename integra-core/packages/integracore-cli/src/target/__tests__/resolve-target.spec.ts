import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { isDefined } from 'integracore-shared/utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { type CliWarning } from '@/output/types/cli-warning.type';
import { resolveTarget } from '@/target/resolve-target';

const CONFIG = {
  version: 1,
  defaultRemote: 'prod',
  remotes: {
    prod: { apiUrl: 'https://acme.integracore.com/', apiKey: 'prod-key' },
    staging: {
      apiUrl: 'https://staging.integracore.com',
      apiKey: 'staging-key',
      integracoreCLIAccessToken: 'staging-access-token',
    },
    signedOut: { apiUrl: 'https://old.integracore.com' },
  },
};

describe('resolveTarget', () => {
  let configPath: string;
  let warnings: CliWarning[];

  const resolve = (
    environment: NodeJS.ProcessEnv,
    remoteFlag?: string,
    path = configPath,
  ) =>
    resolveTarget({
      environment,
      remoteFlag,
      configPath: path,
      signal: new AbortController().signal,
      warn: (warning) => warnings.push(warning),
    });

  beforeEach(async () => {
    const directory = await mkdtemp(join(tmpdir(), 'integracore-cli-target-'));

    configPath = join(directory, 'config.json');
    warnings = [];
    await writeFile(configPath, JSON.stringify(CONFIG));
  });

  it('uses the environment pair without reading the config', async () => {
    await writeFile(configPath, '{ broken');

    await expect(
      resolve({
        INTEGRA_API_URL: 'https://Acme.IntegraCore.com/crm/',
        INTEGRA_API_KEY: 'secret',
      }),
    ).resolves.toEqual({
      apiUrl: 'https://acme.integracore.com/crm',
      bearerToken: 'secret',
      credentialKind: 'apiKey',
      source: 'environment',
    });
  });

  it('falls back to the saved default remote', async () => {
    await expect(resolve({})).resolves.toEqual({
      apiUrl: 'https://acme.integracore.com',
      bearerToken: 'prod-key',
      credentialKind: 'apiKey',
      source: 'remote',
      remoteName: 'prod',
    });
  });

  it('selects a remote with INTEGRA_REMOTE', async () => {
    await expect(resolve({ INTEGRA_REMOTE: 'staging' })).resolves.toMatchObject({
      remoteName: 'staging',
    });
  });

  it('prefers a saved OAuth access token over an API key, like integracore-sdk', async () => {
    await expect(resolve({}, 'staging')).resolves.toMatchObject({
      bearerToken: 'staging-access-token',
      credentialKind: 'oauth',
    });
  });

  it('lets --remote win over the environment and says so', async () => {
    await expect(
      resolve(
        { INTEGRA_API_URL: 'https://other.example.com', INTEGRA_API_KEY: 'k' },
        'staging',
      ),
    ).resolves.toMatchObject({ remoteName: 'staging' });
    expect(warnings).toEqual([
      {
        code: 'ENVIRONMENT_TARGET_IGNORED',
        message:
          'Using remote staging. Ignoring INTEGRA_API_URL and INTEGRA_API_KEY.',
      },
    ]);
  });

  it.each([
    [{}, undefined, 'TARGET_REQUIRED', 2, 'missing.json'],
    [
      { INTEGRA_API_URL: ' ', INTEGRA_API_KEY: '' },
      undefined,
      'TARGET_REQUIRED',
      2,
      'missing.json',
    ],
    [
      { INTEGRA_API_URL: 'https://acme.integracore.com' },
      undefined,
      'INCOMPLETE_TARGET',
      2,
      undefined,
    ],
    [
      { INTEGRA_REMOTE: 'prod', INTEGRA_API_KEY: 'k' },
      undefined,
      'CONFLICTING_TARGET',
      2,
      undefined,
    ],
    [{}, 'nope', 'UNKNOWN_REMOTE', 2, undefined],
    [{}, 'signedOut', 'AUTH_REQUIRED', 3, undefined],
    [
      { INTEGRA_API_URL: 'acme.integracore.com', INTEGRA_API_KEY: 'k' },
      undefined,
      'INVALID_API_URL',
      2,
      undefined,
    ],
    [
      {
        INTEGRA_API_URL: 'https://user:pw@acme.integracore.com',
        INTEGRA_API_KEY: 'k',
      },
      undefined,
      'INVALID_API_URL',
      2,
      undefined,
    ],
    [
      { INTEGRA_API_URL: 'https://acme.integracore.com?x=1', INTEGRA_API_KEY: 'k' },
      undefined,
      'INVALID_API_URL',
      2,
      undefined,
    ],
  ] as const)(
    'fails for %j with --remote %s as %s',
    async (environment, remoteFlag, code, exitCode, configFileName) => {
      const path = isDefined(configFileName)
        ? join(configPath, '..', configFileName)
        : configPath;

      await expect(
        resolve(environment, remoteFlag, path),
      ).rejects.toMatchObject({ code, exitCode });
    },
  );
});
