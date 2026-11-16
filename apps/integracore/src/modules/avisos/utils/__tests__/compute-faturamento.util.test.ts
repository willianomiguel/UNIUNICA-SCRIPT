import { describe, expect, it } from 'vitest';

import { computeFaturamento } from 'src/modules/avisos/utils/compute-faturamento.util';

describe('computeFaturamento', () => {
  it('soma só as vendas aprovadas', () => {
    expect(
      computeFaturamento([
        { status: 'APROVADA', valor: { amountMicros: 100_000_000 } },
        { status: 'APROVADA', valor: { amountMicros: 50_500_000 } },
        { status: 'REEMBOLSADA', valor: { amountMicros: 999_000_000 } },
        { status: 'APROVADA', valor: null },
      ]),
    ).toBe(150.5);
  });
});
