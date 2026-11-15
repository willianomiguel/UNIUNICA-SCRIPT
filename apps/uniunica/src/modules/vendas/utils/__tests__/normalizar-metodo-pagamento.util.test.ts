import { describe, expect, it } from 'vitest';

import { normalizarMetodoPagamento } from 'src/modules/vendas/utils/normalizar-metodo-pagamento.util';

describe('normalizarMetodoPagamento', () => {
  it('maps gateway method names', () => {
    expect(normalizarMetodoPagamento('pix')).toBe('PIX');
    expect(normalizarMetodoPagamento('CREDIT_CARD')).toBe('CARTAO_CREDITO');
    expect(normalizarMetodoPagamento('card')).toBe('CARTAO_CREDITO');
    expect(normalizarMetodoPagamento('ticket')).toBe('BOLETO');
    expect(normalizarMetodoPagamento('BOLETO')).toBe('BOLETO');
  });

  it('returns OUTRO for unknown and null for missing', () => {
    expect(normalizarMetodoPagamento('account_money')).toBe('OUTRO');
    expect(normalizarMetodoPagamento(null)).toBeNull();
    expect(normalizarMetodoPagamento(' ')).toBeNull();
  });
});
