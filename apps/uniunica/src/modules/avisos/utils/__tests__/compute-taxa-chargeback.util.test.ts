import { describe, expect, it } from 'vitest';

import { computeTaxaChargeback } from 'src/modules/avisos/utils/compute-taxa-chargeback.util';

describe('computeTaxaChargeback', () => {
  it('divide chargebacks pelas vendas que foram aprovadas', () => {
    const vendas = [
      ...Array.from({ length: 97 }, () => ({ status: 'APROVADA' })),
      { status: 'REEMBOLSADA' },
      { status: 'CHARGEBACK' },
      { status: 'CHARGEBACK' },
      { status: 'RECUSADA' },
      { status: 'PENDENTE' },
    ];

    expect(computeTaxaChargeback(vendas)).toBe(2);
  });

  it('retorna 0 sem vendas aprovadas', () => {
    expect(computeTaxaChargeback([{ status: 'RECUSADA' }])).toBe(0);
    expect(computeTaxaChargeback([])).toBe(0);
  });
});
