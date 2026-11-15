import { describe, expect, it } from 'vitest';

import { type VendaNormalizada } from 'src/modules/vendas/types/venda-normalizada';
import { montarGravacaoVenda } from 'src/modules/vendas/utils/montar-gravacao-venda.util';

const recebidoEm = '2026-11-15T12:00:00.000Z';
const venda = (parcial: Partial<VendaNormalizada>): VendaNormalizada => ({
  gateway: 'STRIPE',
  idExterno: 'pi_1',
  status: 'APROVADA',
  ...parcial,
});

describe('montarGravacaoVenda', () => {
  it('creates a new sale with a default description and date', () => {
    expect(montarGravacaoVenda({ venda: venda({}), existente: null, recebidoEm })).toEqual({
      operacao: 'CRIAR',
      dados: {
        gateway: 'STRIPE',
        idExterno: 'pi_1',
        status: 'APROVADA',
        descricao: 'Venda pi_1',
        dataEvento: recebidoEm,
      },
    });
  });

  it('updates status, reason and date when the new status is accepted', () => {
    expect(
      montarGravacaoVenda({
        venda: venda({ status: 'CHARGEBACK', motivoRecusa: 'Chargeback: fraudulent', dataEvento: '2026-11-14T00:00:00.000Z' }),
        existente: { id: 'v1', status: 'APROVADA', dataEvento: '2026-11-01T00:00:00.000Z' },
        recebidoEm,
      }),
    ).toEqual({
      operacao: 'ATUALIZAR',
      id: 'v1',
      dados: {
        gateway: 'STRIPE',
        idExterno: 'pi_1',
        status: 'CHARGEBACK',
        motivoRecusa: 'Chargeback: fraudulent',
      },
    });
  });

  it('keeps the stored status and reason for an out-of-order event', () => {
    expect(
      montarGravacaoVenda({
        venda: venda({ status: 'PENDENTE', motivoRecusa: 'x', valor: 10 }),
        existente: { id: 'v1', status: 'REEMBOLSADA', dataEvento: null },
        recebidoEm,
      }),
    ).toEqual({
      operacao: 'ATUALIZAR',
      id: 'v1',
      dados: {
        gateway: 'STRIPE',
        idExterno: 'pi_1',
        status: 'REEMBOLSADA',
        valor: { amountMicros: 10_000_000, currencyCode: 'BRL' },
      },
    });
  });

  it('moves the date to the approval date and fills a missing date', () => {
    const aprovada = montarGravacaoVenda({
      venda: venda({ dataEvento: '2026-11-10T00:00:00.000Z' }),
      existente: { id: 'v1', status: 'PENDENTE', dataEvento: '2026-11-09T00:00:00.000Z' },
      recebidoEm,
    });

    expect(aprovada.dados.dataEvento).toBe('2026-11-10T00:00:00.000Z');
  });
});
