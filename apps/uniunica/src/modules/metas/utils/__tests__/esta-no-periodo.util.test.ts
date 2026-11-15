import { describe, expect, it } from 'vitest';

import { estaNoPeriodo } from 'src/modules/metas/utils/esta-no-periodo.util';

describe('estaNoPeriodo', () => {
  it('inclui os limites e compara só o dia', () => {
    expect(estaNoPeriodo('2026-10-01', '2026-10-01', '2026-12-31')).toBe(true);
    expect(estaNoPeriodo('2026-12-31T23:30:00Z', '2026-10-01', '2026-12-31')).toBe(true);
    expect(estaNoPeriodo('2027-01-01', '2026-10-01', '2026-12-31')).toBe(false);
  });

  it('limites ausentes não restringem; data inválida fica fora', () => {
    expect(estaNoPeriodo('2020-01-01', null, null)).toBe(true);
    expect(estaNoPeriodo(null, null, null)).toBe(false);
    expect(estaNoPeriodo(123, null, null)).toBe(false);
  });
});
