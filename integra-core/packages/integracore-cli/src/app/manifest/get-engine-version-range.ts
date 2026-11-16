import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const getEngineVersionRange = (cwd: string): string | null => {
  try {
    const pkg = JSON.parse(
      readFileSync(join(cwd, 'package.json'), 'utf-8'),
    ) as { engines?: { integracore?: unknown } };

    const range = pkg.engines?.integracore;

    return typeof range === 'string' && range.trim() !== ''
      ? range.trim()
      : null;
  } catch {
    return null;
  }
};
