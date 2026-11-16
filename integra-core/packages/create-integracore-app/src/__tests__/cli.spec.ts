import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const entry = resolve(__dirname, '../cli.ts');

describe('retired scaffolder', () => {
  it.each([[], ['my-app'], ['my-app', '--url', 'http://localhost:3000']])(
    'shows migration instructions without creating an app for %j',
    (...args) => {
      const directory = mkdtempSync(
        join(tmpdir(), 'retired-create-integracore-app-'),
      );

      try {
        const result = spawnSync(process.execPath, [entry, ...args], {
          cwd: directory,
          encoding: 'utf8',
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('create-integracore-app has been retired');
        expect(result.stderr).toContain('npm install -g integracore');
        expect(result.stderr).toContain('integracore app init my-app');
        expect(result.stderr).toContain('integracore app dev');
        expect(readdirSync(directory)).toEqual([]);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
  );
});
