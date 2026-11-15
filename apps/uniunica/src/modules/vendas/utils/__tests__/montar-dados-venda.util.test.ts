import { describe, expect, it } from 'vitest';

import { montarDadosVenda } from 'src/modules/vendas/utils/montar-dados-venda.util';

describe('montarDadosVenda', () => {
  it('converts amounts to micros and emails to the EMAILS shape', () => {
    expect(
      montarDadosVenda({
        gateway: 'STRIPE',
        idExterno: 'pi_1',
        status: 'APROVADA',
        moeda: 'brl',
        valor: 197,
        valorLiquido: 187.5,
        taxaGateway: 9.5,
        clienteEmail: 'Ana@Exemplo.com',
        parcelas: 3,
      }),
    ).toEqual({
      gateway: 'STRIPE',
      idExterno: 'pi_1',
      status: 'APROVADA',
      valor: { amountMicros: 197_000_000, currencyCode: 'BRL' },
      valorLiquido: { amountMicros: 187_500_000, currencyCode: 'BRL' },
      taxaGateway: { amountMicros: 9_500_000, currencyCode: 'BRL' },
      clienteEmail: { primaryEmail: 'ana@exemplo.com', additionalEmails: null },
      parcelas: 3,
    });
  });

  it('omits fields the event does not carry and defaults the currency to BRL', () => {
    expect(
      montarDadosVenda({ gateway: 'ASAAS', idExterno: 'pay_1', status: 'CHARGEBACK', valor: 10, descricao: null }),
    ).toEqual({
      gateway: 'ASAAS',
      idExterno: 'pay_1',
      status: 'CHARGEBACK',
      valor: { amountMicros: 10_000_000, currencyCode: 'BRL' },
    });
  });
});
