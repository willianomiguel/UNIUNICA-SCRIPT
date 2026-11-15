import { describe, expect, it } from 'vitest';

import { normalizarWebhookGenerico } from 'src/modules/vendas/utils/normalizar-webhook-generico.util';

describe('normalizarWebhookGenerico', () => {
  it('normalizes the documented format', () => {
    const resultado = normalizarWebhookGenerico({
      idExterno: 'pedido-123',
      status: 'aprovada',
      gateway: 'asaas',
      valor: 197,
      valorLiquido: '187,50',
      taxaGateway: 9.5,
      produto: 'Curso X',
      metodoPagamento: 'pix',
      parcelas: 1,
      clienteNome: 'Maria',
      clienteEmail: 'maria@exemplo.com',
      dataEvento: '2026-11-10T12:00:00-03:00',
      utm: { source: 'instagram', medium: 'stories', campaign: 'black-friday' },
    });

    expect(resultado).toEqual({
      tipo: 'VENDA',
      tipoEvento: 'venda.aprovada',
      venda: {
        gateway: 'ASAAS',
        idExterno: 'pedido-123',
        status: 'APROVADA',
        forcarStatus: false,
        moeda: null,
        valor: 197,
        valorLiquido: 187.5,
        taxaGateway: 9.5,
        descricao: 'Curso X',
        metodoPagamento: 'PIX',
        parcelas: 1,
        clienteNome: 'Maria',
        clienteEmail: 'maria@exemplo.com',
        dataEvento: '2026-11-10T15:00:00.000Z',
        motivoRecusa: null,
        utmSource: 'instagram',
        utmMedium: 'stories',
        utmCampaign: 'black-friday',
      },
    });
  });

  it('defaults gateway to OUTRO and keeps an explicit event type', () => {
    const resultado = normalizarWebhookGenerico({ idExterno: 'x', status: 'RECUSADA', tipo: 'cartao.recusado' });

    expect(resultado.tipo).toBe('VENDA');
    expect(resultado.tipoEvento).toBe('cartao.recusado');
    expect(resultado.tipo === 'VENDA' && resultado.venda.gateway).toBe('OUTRO');
  });

  it('ignores payloads without idExterno or with an invalid status', () => {
    expect(normalizarWebhookGenerico({ status: 'APROVADA' })).toMatchObject({
      tipo: 'IGNORADO',
      idExterno: null,
    });
    expect(normalizarWebhookGenerico({ idExterno: '1', status: 'talvez' })).toMatchObject({
      tipo: 'IGNORADO',
      idExterno: '1',
    });
    expect(normalizarWebhookGenerico(null)).toMatchObject({ tipo: 'IGNORADO' });
  });
});
