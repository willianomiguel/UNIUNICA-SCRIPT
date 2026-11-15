import { describe, expect, it } from 'vitest';

import { estaAtrasado } from 'src/modules/financeiro/utils/esta-atrasado.util';

describe('estaAtrasado', () => {
  const hoje = '2026-11-15';

  it('pendente com vencimento passado está atrasado', () => {
    expect(estaAtrasado({ status: 'PENDENTE', vencimento: '2026-11-14', data: null }, hoje)).toBe(true);
  });

  it('vence hoje ou no futuro não está atrasado', () => {
    expect(estaAtrasado({ status: 'PENDENTE', vencimento: '2026-11-15', data: null }, hoje)).toBe(false);
  });

  it('usa a data quando não há vencimento', () => {
    expect(estaAtrasado({ status: 'PENDENTE', vencimento: null, data: '2026-10-01' }, hoje)).toBe(true);
    expect(estaAtrasado({ status: 'PENDENTE', vencimento: null, data: null }, hoje)).toBe(false);
  });

  it('só considera pendentes', () => {
    expect(estaAtrasado({ status: 'PAGO', vencimento: '2026-01-01', data: null }, hoje)).toBe(false);
    expect(estaAtrasado({ status: 'ATRASADO', vencimento: '2026-01-01', data: null }, hoje)).toBe(false);
  });
});
