import { describe, expect, it } from 'vitest';

import { computeTaxaRecusa } from 'src/modules/avisos/utils/compute-taxa-recusa.util';

describe('computeTaxaRecusa', () => {
  it('considera recusadas e falhas sobre tentativas concluídas', () => {
    const vendas = [
      { status: 'APROVADA' },
      { status: 'APROVADA' },
      { status: 'RECUSADA' },
      { status: 'FALHA' },
      { status: 'PENDENTE' },
      { status: 'CANCELADA' },
    ];

    expect(computeTaxaRecusa(vendas)).toBe(50);
  });

  it('retorna 0 sem tentativas', () => {
    expect(computeTaxaRecusa([{ status: 'PENDENTE' }])).toBe(0);
  });
});
