import { describe, expect, it } from 'vitest';

import { getQuarterStart } from 'src/modules/projetos/utils/get-quarter-start.util';

describe('getQuarterStart', () => {
  const nov15 = Date.UTC(2026, 10, 15);

  it('devolve o início do trimestre corrente', () => {
    expect(getQuarterStart(nov15)).toBe(Date.UTC(2026, 9, 1));
  });

  it('desloca trimestres e atravessa o ano', () => {
    expect(getQuarterStart(nov15, 1)).toBe(Date.UTC(2027, 0, 1));
    expect(getQuarterStart(nov15, 2)).toBe(Date.UTC(2027, 3, 1));
    expect(getQuarterStart(nov15, -4)).toBe(Date.UTC(2025, 9, 1));
  });

  it('o primeiro dia do trimestre é o próprio início', () => {
    expect(getQuarterStart(Date.UTC(2026, 3, 1))).toBe(Date.UTC(2026, 3, 1));
  });
});
