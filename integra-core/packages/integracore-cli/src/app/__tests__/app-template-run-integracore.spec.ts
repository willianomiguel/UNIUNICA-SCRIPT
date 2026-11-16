import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runIntegraCore } from '../../../app-template/example/files/src/__tests__/run-integracore';

describe('runIntegraCore in the app template', () => {
  let root: string;

  const writeExecutable = async (path: string, source: string) => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `#!/usr/bin/env node\n${source}\n`);
    await chmod(path, 0o755);
  };

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'integracore-run-integracore-'));
    vi.stubEnv('INTEGRA_CLI', undefined);
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await rm(root, { recursive: true, force: true });
  });

  it('runs the global CLI, skipping the binaries a package manager puts first on PATH', async () => {
    const packageManagerBin = join(root, 'package-manager-bin');
    const projectBin = join(root, 'app', 'node_modules', '.bin');
    const globalBin = join(root, 'global-bin');

    await writeExecutable(
      join(packageManagerBin, 'integracore'),
      "console.log('package manager binary');",
    );
    await writeExecutable(
      join(projectBin, 'integracore'),
      "console.log('project binary');",
    );
    await writeExecutable(
      join(globalBin, 'integracore'),
      'console.log(JSON.stringify({ ok: true, data: { args: process.argv.slice(2) } }));',
    );
    vi.stubEnv(
      'PATH',
      [packageManagerBin, projectBin, globalBin, process.env.PATH].join(
        delimiter,
      ),
    );
    vi.stubEnv('BERRY_BIN_FOLDER', packageManagerBin);

    await expect(runIntegraCore(['app', 'apply', '--create'])).resolves.toEqual({
      ok: true,
      data: { args: ['app', 'apply', '--create', '--json'] },
    });
  });

  it('returns a CLI failure as a result instead of throwing', async () => {
    const cliPath = join(root, 'integracore');

    await writeExecutable(
      cliPath,
      "console.log(JSON.stringify({ ok: false, error: { code: 'APP_NOT_INSTALLED', message: 'Not installed.' } })); process.exitCode = 4;",
    );
    vi.stubEnv('INTEGRA_CLI', cliPath);

    await expect(runIntegraCore(['app', 'uninstall', '--yes'])).resolves.toEqual({
      ok: false,
      error: { code: 'APP_NOT_INSTALLED', message: 'Not installed.' },
    });
  });

  it('explains how to install the CLI when the executable is missing', async () => {
    vi.stubEnv('INTEGRA_CLI', join(root, 'missing', 'integracore'));

    await expect(runIntegraCore(['app', 'build'])).rejects.toThrow(
      'was not found. Install the IntegraCore CLI globally, or set INTEGRA_CLI to its path.',
    );
  });

  it('rejects output that is not a CLI JSON result', async () => {
    const cliPath = join(root, 'integracore');

    await writeExecutable(
      cliPath,
      "console.log('Did you mean apply?'); process.exitCode = 1;",
    );
    vi.stubEnv('INTEGRA_CLI', cliPath);

    await expect(runIntegraCore(['app', 'build'])).rejects.toThrow(
      'app build exited with code 1 without a JSON result',
    );
  });
});
