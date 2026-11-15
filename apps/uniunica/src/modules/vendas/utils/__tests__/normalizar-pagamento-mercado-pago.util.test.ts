import { describe, expect, it } from 'vitest';

import { normalizarPagamentoMercadoPago } from 'src/modules/vendas/utils/normalizar-pagamento-mercado-pago.util';

const pagamento = {
  id: 1234567890,
  status: 'approved',
  status_detail: 'accredited',
  currency_id: 'BRL',
  transaction_amount: 297,
  transaction_details: { net_received_amount: 282.15 },
  fee_details: [{ type: 'mercadopago_fee', amount: 14.85 }],
  installments: 2,
  payment_method_id: 'master',
  payment_type_id: 'credit_card',
  description: 'Imersão',
  payer: { email: 'joao@exemplo.com', first_name: 'João', last_name: 'Silva' },
  date_created: '2026-11-10T10:00:00.000-04:00',
  date_approved: '2026-11-10T10:01:00.000-04:00',
  metadata: { utm_source: 'facebook' },
};

describe('normalizarPagamentoMercadoPago', () => {
  it('maps an approved payment with fees and net amount', () => {
    expect(normalizarPagamentoMercadoPago(pagamento, 'payment.updated')).toEqual({
      tipo: 'VENDA',
      tipoEvento: 'payment.updated',
      venda: {
        gateway: 'MERCADO_PAGO',
        idExterno: '1234567890',
        status: 'APROVADA',
        moeda: 'BRL',
        valor: 297,
        valorLiquido: 282.15,
        taxaGateway: 14.85,
        descricao: 'Imersão',
        metodoPagamento: 'CARTAO_CREDITO',
        parcelas: 2,
        clienteNome: 'João Silva',
        clienteEmail: 'joao@exemplo.com',
        dataEvento: '2026-11-10T14:01:00.000Z',
        motivoRecusa: null,
        utmSource: 'facebook',
        utmMedium: null,
        utmCampaign: null,
      },
    });
  });

  it('maps rejections, refunds, chargebacks and pix', () => {
    expect(
      normalizarPagamentoMercadoPago({ ...pagamento, status: 'rejected', status_detail: 'cc_rejected_insufficient_amount' }, 'x'),
    ).toMatchObject({ venda: { status: 'RECUSADA', motivoRecusa: 'cc_rejected_insufficient_amount' } });
    expect(normalizarPagamentoMercadoPago({ ...pagamento, status: 'refunded' }, 'x')).toMatchObject({ venda: { status: 'REEMBOLSADA' } });
    expect(normalizarPagamentoMercadoPago({ ...pagamento, status: 'charged_back' }, 'x')).toMatchObject({ venda: { status: 'CHARGEBACK' } });
    expect(normalizarPagamentoMercadoPago({ ...pagamento, status: 'in_process' }, 'x')).toMatchObject({ venda: { status: 'PENDENTE' } });
    expect(
      normalizarPagamentoMercadoPago({ ...pagamento, payment_method_id: 'pix', payment_type_id: 'bank_transfer' }, 'x'),
    ).toMatchObject({ venda: { metodoPagamento: 'PIX' } });
  });

  it('handles missing optional data', () => {
    expect(
      normalizarPagamentoMercadoPago({ id: 1, status: 'pending' }, 'x'),
    ).toMatchObject({ venda: { taxaGateway: null, clienteNome: null, valor: null, dataEvento: null } });
  });

  it('ignores unknown statuses and payments without id', () => {
    expect(normalizarPagamentoMercadoPago({ ...pagamento, status: 'weird' }, 'x')).toMatchObject({ tipo: 'IGNORADO', idExterno: '1234567890' });
    expect(normalizarPagamentoMercadoPago({}, 'x')).toMatchObject({ tipo: 'IGNORADO', idExterno: null });
  });
});
