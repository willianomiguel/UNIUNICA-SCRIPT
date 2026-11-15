import { describe, expect, it } from 'vitest';

import { lerFormatoImportacao } from 'src/modules/vendas/utils/ler-formato-importacao.util';

describe('lerFormatoImportacao', () => {
  it('defaults to generico and accepts known formats', () => {
    expect(lerFormatoImportacao(undefined)).toBe('generico');
    expect(lerFormatoImportacao('Stripe')).toBe('stripe');
    expect(lerFormatoImportacao('mercado-pago')).toBe('mercado_pago');
  });

  it('rejects unknown formats', () => {
    expect(lerFormatoImportacao('paypal')).toBeNull();
  });
});
