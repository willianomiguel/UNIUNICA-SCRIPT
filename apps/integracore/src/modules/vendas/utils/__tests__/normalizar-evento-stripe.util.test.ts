import { describe, expect, it } from 'vitest';

import { normalizarEventoStripe } from 'src/modules/vendas/utils/normalizar-evento-stripe.util';

const evento = (type: string, object: Record<string, unknown>) => ({
  id: 'evt_1',
  type,
  data: { object },
});

const paymentIntent = {
  id: 'pi_123',
  amount: 19700,
  currency: 'brl',
  created: 1_763_000_000,
  description: 'Mentoria',
  receipt_email: 'ana@exemplo.com',
  payment_method_types: ['card'],
  payment_method_options: { card: { installments: { plan: { count: 3 } } } },
  metadata: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'lancamento' },
};

describe('normalizarEventoStripe', () => {
  it('maps payment_intent.succeeded to an approved sale', () => {
    const resultado = normalizarEventoStripe(evento('payment_intent.succeeded', paymentIntent));

    expect(resultado).toMatchObject({
      tipo: 'VENDA',
      tipoEvento: 'payment_intent.succeeded',
      venda: {
        gateway: 'STRIPE',
        idExterno: 'pi_123',
        status: 'APROVADA',
        valor: 197,
        moeda: 'BRL',
        descricao: 'Mentoria',
        metodoPagamento: 'CARTAO_CREDITO',
        parcelas: 3,
        clienteEmail: 'ana@exemplo.com',
        dataEvento: new Date(1_763_000_000_000).toISOString(),
        motivoRecusa: null,
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'lancamento',
      },
    });
  });

  it('distinguishes card declines from other failures', () => {
    const recusa = normalizarEventoStripe(
      evento('payment_intent.payment_failed', {
        ...paymentIntent,
        last_payment_error: { code: 'card_declined', decline_code: 'insufficient_funds', message: 'Your card has insufficient funds.' },
      }),
    );
    const falha = normalizarEventoStripe(
      evento('payment_intent.payment_failed', { ...paymentIntent, last_payment_error: { code: 'processing_error' } }),
    );

    expect(recusa).toMatchObject({
      venda: { status: 'RECUSADA', motivoRecusa: 'Your card has insufficient funds. — insufficient_funds' },
    });
    expect(falha).toMatchObject({ venda: { status: 'FALHA', motivoRecusa: 'Pagamento não concluído' } });
  });

  it('maps processing and canceled intents', () => {
    expect(normalizarEventoStripe(evento('payment_intent.processing', paymentIntent))).toMatchObject({ venda: { status: 'PENDENTE' } });
    expect(
      normalizarEventoStripe(evento('payment_intent.canceled', { ...paymentIntent, cancellation_reason: 'abandoned' })),
    ).toMatchObject({ venda: { status: 'CANCELADA', motivoRecusa: 'abandoned' } });
  });

  it('maps full refunds to the payment intent and ignores partial ones', () => {
    const charge = { id: 'ch_1', payment_intent: 'pi_123', amount: 19700, amount_refunded: 19700, refunded: true, currency: 'brl' };

    expect(normalizarEventoStripe(evento('charge.refunded', charge))).toMatchObject({
      venda: { idExterno: 'pi_123', status: 'REEMBOLSADA', valor: 197 },
    });
    expect(
      normalizarEventoStripe(evento('charge.refunded', { ...charge, refunded: false, amount_refunded: 5000 })),
    ).toMatchObject({ tipo: 'IGNORADO', idExterno: 'pi_123', motivo: 'Reembolso parcial de 50.00 BRL — status mantido' });
  });

  it('maps disputes to chargebacks and won disputes back to approved', () => {
    const disputa = { id: 'dp_1', charge: 'ch_1', payment_intent: 'pi_123', reason: 'fraudulent', status: 'needs_response' };

    expect(normalizarEventoStripe(evento('charge.dispute.created', disputa))).toMatchObject({
      venda: { idExterno: 'pi_123', status: 'CHARGEBACK', motivoRecusa: 'Chargeback: fraudulent' },
    });
    expect(normalizarEventoStripe(evento('charge.dispute.closed', { ...disputa, status: 'won' }))).toMatchObject({
      venda: { status: 'APROVADA', forcarStatus: true },
    });
    expect(normalizarEventoStripe(evento('charge.dispute.closed', { ...disputa, status: 'lost' }))).toMatchObject({
      venda: { status: 'CHARGEBACK' },
    });
    expect(normalizarEventoStripe(evento('charge.dispute.closed', { ...disputa, status: 'warning_closed' }))).toMatchObject({
      tipo: 'IGNORADO',
    });
  });

  it('falls back to the charge id when the dispute has no payment intent', () => {
    expect(
      normalizarEventoStripe(evento('charge.dispute.created', { id: 'dp_1', charge: 'ch_9' })),
    ).toMatchObject({ venda: { idExterno: 'ch_9' } });
  });

  it('ignores unknown events and objects without ids', () => {
    expect(normalizarEventoStripe(evento('customer.created', { id: 'cus_1' }))).toMatchObject({
      tipo: 'IGNORADO',
      tipoEvento: 'customer.created',
      idExterno: 'cus_1',
    });
    expect(normalizarEventoStripe(evento('payment_intent.succeeded', {}))).toMatchObject({ tipo: 'IGNORADO' });
    expect(normalizarEventoStripe({})).toMatchObject({ tipo: 'IGNORADO', tipoEvento: 'desconhecido' });
  });
});
