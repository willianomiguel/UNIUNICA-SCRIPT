import { describe, expect, it } from 'vitest';

import { extrairIdPagamentoMercadoPago } from 'src/modules/vendas/utils/extrair-id-pagamento-mercado-pago.util';

describe('extrairIdPagamentoMercadoPago', () => {
  it('reads Webhooks notifications from the body', () => {
    expect(
      extrairIdPagamentoMercadoPago({ type: 'payment', action: 'payment.updated', data: { id: '123' } }, {}),
    ).toEqual({ idPagamento: '123', tipoEvento: 'payment.updated' });
  });

  it('reads the id from the query string', () => {
    expect(extrairIdPagamentoMercadoPago(null, { type: 'payment', 'data.id': '456' })).toEqual({
      idPagamento: '456',
      tipoEvento: 'payment',
    });
    expect(extrairIdPagamentoMercadoPago(null, { topic: 'payment', id: '789' })).toEqual({
      idPagamento: '789',
      tipoEvento: 'payment',
    });
  });

  it('reads legacy IPN resource URLs', () => {
    expect(
      extrairIdPagamentoMercadoPago({ topic: 'payment', resource: 'https://api.mercadolibre.com/collections/notifications/321' }, {}),
    ).toEqual({ idPagamento: '321', tipoEvento: 'payment' });
  });

  it('ignores non-payment topics', () => {
    expect(extrairIdPagamentoMercadoPago({ type: 'merchant_order', data: { id: '1' } }, {})).toEqual({
      idPagamento: null,
      tipoEvento: 'merchant_order',
    });
  });
});
