import { describe, expect, it } from 'vitest';

import { toUtcDay } from 'src/modules/projetos/utils/to-utc-day.util';

describe('toUtcDay', () => {
  it('usa o dia do calendário local e zera a hora', () => {
    expect(toUtcDay(new Date(2026, 10, 15, 23, 30))).toBe(Date.UTC(2026, 10, 15));
    expect(toUtcDay(new Date(2026, 10, 15, 0, 5))).toBe(Date.UTC(2026, 10, 15));
  });
});
