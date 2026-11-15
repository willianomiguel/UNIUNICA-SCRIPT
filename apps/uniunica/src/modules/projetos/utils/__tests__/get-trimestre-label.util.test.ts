import { describe, expect, it } from 'vitest';

import { getTrimestreLabel } from 'src/modules/projetos/utils/get-trimestre-label.util';

describe('getTrimestreLabel', () => {
  it.each([
    [Date.UTC(2026, 0, 1), '2026-T1'],
    [Date.UTC(2026, 2, 31), '2026-T1'],
    [Date.UTC(2026, 3, 1), '2026-T2'],
    [Date.UTC(2026, 8, 30), '2026-T3'],
    [Date.UTC(2026, 10, 15), '2026-T4'],
  ])('%s → %s', (ms, label) => {
    expect(getTrimestreLabel(ms)).toBe(label);
  });
});
