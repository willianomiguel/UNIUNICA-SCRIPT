import { describe, expect, it } from 'vitest';

import { normalizarStatusGenerico } from 'src/modules/vendas/utils/normalizar-status-generico.util';

describe('normalizarStatusGenerico', () => {
  it('accepts Portuguese and English names in any case', () => {
    expect(normalizarStatusGenerico('APROVADA')).toBe('APROVADA');
    expect(normalizarStatusGenerico('paid')).toBe('APROVADA');
    expect(normalizarStatusGenerico('Recusada')).toBe('RECUSADA');
    expect(normalizarStatusGenerico('refunded')).toBe('REEMBOLSADA');
    expect(normalizarStatusGenerico('chargeback')).toBe('CHARGEBACK');
    expect(normalizarStatusGenerico('cancelled')).toBe('CANCELADA');
  });

  it('returns null for unknown or missing status', () => {
    expect(normalizarStatusGenerico('talvez')).toBeNull();
    expect(normalizarStatusGenerico(null)).toBeNull();
  });
});
