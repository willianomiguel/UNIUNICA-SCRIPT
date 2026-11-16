import { describe, expect, it } from 'vitest';

import { normalizarEventoAsaas } from 'src/modules/vendas/utils/normalizar-evento-asaas.util';

const payment = {
  id: 'pay_080225913252',
  value: 100,
  netValue: 98.01,
  billingType: 'CREDIT_CARD',
  description: 'Assinatura mensal',
  installmentCount: 2,
  dateCreated: '2026-11-01',
  confirmedDate: '2026-11-02',
};

describe('normalizarEventoAsaas', () => {
  it('maps a confirmed payment with fee and confirmation date', () => {
    expect(normalizarEventoAsaas({ event: 'PAYMENT_CONFIRMED', payment })).toEqual({
      tipo: 'VENDA',
      tipoEvento: 'PAYMENT_CONFIRMED',
      venda: {
        gateway: 'ASAAS',
        idExterno: 'pay_080225913252',
        status: 'APROVADA',
        forcarStatus: undefined,
        moeda: 'BRL',
        valor: 100,
        valorLiquido: 98.01,
        taxaGateway: 1.99,
        descricao: 'Assinatura mensal',
        metodoPagamento: 'CARTAO_CREDITO',
        parcelas: 2,
        dataEvento: '2026-11-02T00:00:00.000Z',
        motivoRecusa: null,
      },
    });
  });

  it('maps refunds, chargebacks, overdue and refused events', () => {
    expect(normalizarEventoAsaas({ event: 'PAYMENT_REFUNDED', payment })).toMatchObject({ venda: { status: 'REEMBOLSADA' } });
    expect(normalizarEventoAsaas({ event: 'PAYMENT_CHARGEBACK_REQUESTED', payment })).toMatchObject({ venda: { status: 'CHARGEBACK' } });
    expect(normalizarEventoAsaas({ event: 'PAYMENT_OVERDUE', payment: { ...payment, billingType: 'BOLETO' } })).toMatchObject({
      venda: { status: 'FALHA', metodoPagamento: 'BOLETO', motivoRecusa: 'Cobrança vencida sem pagamento' },
    });
    expect(normalizarEventoAsaas({ event: 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', payment })).toMatchObject({ venda: { status: 'RECUSADA' } });
    expect(normalizarEventoAsaas({ event: 'PAYMENT_RESTORED', payment })).toMatchObject({ venda: { status: 'PENDENTE', forcarStatus: true } });
  });

  it('treats an UNDEFINED billing type as unknown', () => {
    expect(normalizarEventoAsaas({ event: 'PAYMENT_CREATED', payment: { ...payment, billingType: 'UNDEFINED' } })).toMatchObject({
      venda: { status: 'PENDENTE', metodoPagamento: null, dataEvento: '2026-11-01T00:00:00.000Z' },
    });
  });

  it('ignores unknown events and events without payment', () => {
    expect(normalizarEventoAsaas({ event: 'PAYMENT_UPDATED', payment })).toMatchObject({ tipo: 'IGNORADO', idExterno: payment.id });
    expect(normalizarEventoAsaas({ event: 'PAYMENT_CONFIRMED' })).toMatchObject({ tipo: 'IGNORADO', idExterno: null });
  });
});
