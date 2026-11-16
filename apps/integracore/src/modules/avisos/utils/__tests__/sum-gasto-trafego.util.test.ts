import { describe, expect, it } from 'vitest';

import { sumGastoTrafego } from 'src/modules/avisos/utils/sum-gasto-trafego.util';

describe('sumGastoTrafego', () => {
  it('soma o gasto das métricas do dia', () => {
    expect(
      sumGastoTrafego(
        [
          { data: '2026-11-15', gasto: { amountMicros: 200_000_000 } },
          { data: '2026-11-15', gasto: { amountMicros: 30_000_000 } },
          { data: '2026-11-14', gasto: { amountMicros: 999_000_000 } },
          { data: null, gasto: { amountMicros: 1 } },
        ],
        '2026-11-15',
      ),
    ).toBe(230);
  });
});
