import { describe, expect, it } from 'vitest';

import { normalizarPorFormato } from 'src/modules/vendas/utils/normalizar-por-formato.util';

describe('normalizarPorFormato', () => {
  it('routes each format to its normalizer and gateway', () => {
    expect(normalizarPorFormato('stripe', { type: 'payment_intent.succeeded', data: { object: { id: 'pi_1' } } })).toMatchObject({
      gateway: 'STRIPE',
      resultado: { tipo: 'VENDA' },
    });
    expect(normalizarPorFormato('asaas', { event: 'PAYMENT_RECEIVED', payment: { id: 'pay_1' } }).gateway).toBe('ASAAS');
    expect(normalizarPorFormato('pagarme', { type: 'charge.paid', data: { id: 'ch_1' } }).gateway).toBe('PAGARME');
    expect(normalizarPorFormato('mercado_pago', { id: 1, status: 'approved' })).toMatchObject({
      gateway: 'MERCADO_PAGO',
      resultado: { tipo: 'VENDA', tipoEvento: 'importacao.mercado_pago' },
    });
  });

  it('uses the gateway declared in the generic payload', () => {
    expect(normalizarPorFormato('generico', { idExterno: '1', status: 'APROVADA', gateway: 'stripe' }).gateway).toBe('STRIPE');
    expect(normalizarPorFormato('generico', { idExterno: '1', status: 'APROVADA' }).gateway).toBe('OUTRO');
  });
});
