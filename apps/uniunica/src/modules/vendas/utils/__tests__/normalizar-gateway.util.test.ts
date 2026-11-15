import { describe, expect, it } from 'vitest';

import { normalizarGateway } from 'src/modules/vendas/utils/normalizar-gateway.util';

describe('normalizarGateway', () => {
  it('maps known gateway names', () => {
    expect(normalizarGateway('Mercado Pago', 'OUTRO')).toBe('MERCADO_PAGO');
    expect(normalizarGateway('pagar.me', 'OUTRO')).toBe('PAGARME');
    expect(normalizarGateway('STRIPE', 'OUTRO')).toBe('STRIPE');
  });

  it('uses the default when missing and OUTRO when unknown', () => {
    expect(normalizarGateway(null, 'MANUAL')).toBe('MANUAL');
    expect(normalizarGateway('paypal', 'MANUAL')).toBe('OUTRO');
  });
});
