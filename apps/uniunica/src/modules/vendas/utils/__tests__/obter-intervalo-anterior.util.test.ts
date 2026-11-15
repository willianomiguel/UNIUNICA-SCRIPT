import { describe, expect, it } from 'vitest';

import { obterIntervaloAnterior } from 'src/modules/vendas/utils/obter-intervalo-anterior.util';

describe('obterIntervaloAnterior', () => {
  it('returns the window of equal length ending where the given one starts', () => {
    expect(
      obterIntervaloAnterior({
        inicio: new Date('2026-11-08T00:00:00Z'),
        fim: new Date('2026-11-15T00:00:00Z'),
      }),
    ).toEqual({
      inicio: new Date('2026-11-01T00:00:00Z'),
      fim: new Date('2026-11-08T00:00:00Z'),
    });
  });
});
