import { describe, expect, it } from 'vitest';

import { normalizarEventoPagarme } from 'src/modules/vendas/utils/normalizar-evento-pagarme.util';

const charge = {
  id: 'ch_abc',
  code: 'PED-1',
  amount: 49900,
  currency: 'BRL',
  payment_method: 'credit_card',
  created_at: '2026-11-10T13:00:00Z',
  paid_at: '2026-11-10T13:00:05Z',
  customer: { name: 'Carla', email: 'carla@exemplo.com' },
  last_transaction: { installments: 6, status: 'captured' },
  metadata: { utm_campaign: 'perpetuo' },
};

describe('normalizarEventoPagarme', () => {
  it('maps charge.paid', () => {
    expect(normalizarEventoPagarme({ type: 'charge.paid', data: charge })).toEqual({
      tipo: 'VENDA',
      tipoEvento: 'charge.paid',
      venda: {
        gateway: 'PAGARME',
        idExterno: 'ch_abc',
        status: 'APROVADA',
        moeda: 'BRL',
        valor: 499,
        descricao: 'PED-1',
        metodoPagamento: 'CARTAO_CREDITO',
        parcelas: 6,
        clienteNome: 'Carla',
        clienteEmail: 'carla@exemplo.com',
        dataEvento: '2026-11-10T13:00:05.000Z',
        motivoRecusa: null,
        utmSource: null,
        utmMedium: null,
        utmCampaign: 'perpetuo',
      },
    });
  });

  it('separates issuer refusals from technical failures', () => {
    expect(
      normalizarEventoPagarme({
        type: 'charge.payment_failed',
        data: { ...charge, last_transaction: { status: 'not_authorized', acquirer_message: 'Transação negada' } },
      }),
    ).toMatchObject({ venda: { status: 'RECUSADA', motivoRecusa: 'Transação negada' } });
    expect(
      normalizarEventoPagarme({
        type: 'charge.payment_failed',
        data: { ...charge, last_transaction: { status: 'with_error', gateway_response: { errors: [{ message: 'Timeout' }] } } },
      }),
    ).toMatchObject({ venda: { status: 'FALHA', motivoRecusa: 'Timeout' } });
  });

  it('maps refunds and chargebacks', () => {
    expect(normalizarEventoPagarme({ type: 'charge.refunded', data: charge })).toMatchObject({ venda: { status: 'REEMBOLSADA' } });
    expect(normalizarEventoPagarme({ type: 'charge.chargedback', data: charge })).toMatchObject({ venda: { status: 'CHARGEBACK' } });
  });

  it('ignores order events and charges without id', () => {
    expect(normalizarEventoPagarme({ type: 'order.paid', data: { id: 'or_1' } })).toMatchObject({ tipo: 'IGNORADO' });
    expect(normalizarEventoPagarme({ type: 'charge.paid', data: {} })).toMatchObject({ tipo: 'IGNORADO', idExterno: null });
  });
});
