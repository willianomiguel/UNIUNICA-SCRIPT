import { describe, expect, it } from 'vitest';

import { montarVendasExemplo } from 'src/modules/vendas/utils/montar-vendas-exemplo.util';

describe('montarVendasExemplo', () => {
  const agora = new Date('2026-11-15T15:00:00.000Z');
  const vendas = montarVendasExemplo(agora);

  it('builds labelled examples with stable unique ids', () => {
    expect(vendas.length).toBeGreaterThanOrEqual(8);
    expect(new Set(vendas.map((venda) => venda.idExterno)).size).toBe(vendas.length);
    expect(vendas.every((venda) => venda.descricao?.startsWith('[Exemplo]'))).toBe(true);
    expect(montarVendasExemplo(agora).map((venda) => venda.idExterno)).toEqual(vendas.map((venda) => venda.idExterno));
  });

  it('covers every status and dates within the last 30 days', () => {
    expect(new Set(vendas.map((venda) => venda.status))).toEqual(
      new Set(['APROVADA', 'RECUSADA', 'PENDENTE', 'FALHA', 'REEMBOLSADA', 'CHARGEBACK']),
    );
    expect(
      vendas.every((venda) => {
        const dias = (agora.getTime() - new Date(venda.dataEvento ?? 0).getTime()) / 86_400_000;

        return dias >= 0 && dias < 30;
      }),
    ).toBe(true);
  });

  it('only charges fees on paid sales and strips accents from emails', () => {
    expect(vendas.find((venda) => venda.status === 'RECUSADA')?.taxaGateway).toBeNull();
    expect(vendas[0]).toMatchObject({ valor: 497, taxaGateway: 24.8, valorLiquido: 472.2 });
    expect(vendas.find((venda) => venda.clienteNome === 'Fábio Costa')?.clienteEmail).toBe('fabio@exemplo.com');
  });
});
