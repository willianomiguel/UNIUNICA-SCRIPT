import { describe, expect, it } from 'vitest';

import { type VendaResumo } from 'src/modules/financeiro/types/venda-resumo';
import { sincronizarLancamentoVenda } from 'src/modules/financeiro/utils/sincronizar-lancamento-venda.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

const venda = (status: string): VendaResumo => ({
  id: 'v1',
  status,
  descricao: 'Curso',
  valor: 100,
  valorLiquido: 90,
  dataEvento: '2026-11-10',
});

describe('sincronizarLancamentoVenda', () => {
  it('cria a entrada uma única vez', async () => {
    const { cliente, banco } = criarClienteRestFalso();

    expect(await sincronizarLancamentoVenda(cliente, venda('APROVADA'), '2026-11-15')).toBe('CRIADO');
    expect(await sincronizarLancamentoVenda(cliente, venda('APROVADA'), '2026-11-15')).toBe('JA_EXISTE');
    expect(banco.lancamentos).toHaveLength(1);
    expect(banco.lancamentos[0]).toMatchObject({ tipo: 'ENTRADA', vendaId: 'v1', origem: 'VENDA' });
  });

  it('cria o estorno só depois da entrada e uma única vez', async () => {
    const { cliente, banco } = criarClienteRestFalso();

    expect(await sincronizarLancamentoVenda(cliente, venda('CHARGEBACK'), '2026-11-15')).toBe(
      'SEM_ENTRADA_ORIGINAL',
    );
    await sincronizarLancamentoVenda(cliente, venda('APROVADA'), '2026-11-15');
    expect(await sincronizarLancamentoVenda(cliente, venda('REEMBOLSADA'), '2026-11-16')).toBe('CRIADO');
    expect(await sincronizarLancamentoVenda(cliente, venda('CHARGEBACK'), '2026-11-17')).toBe('JA_EXISTE');
    expect(banco.lancamentos.map((registro) => registro.tipo)).toEqual(['ENTRADA', 'SAIDA']);
  });

  it('ignora status sem lançamento', async () => {
    const { cliente, chamadas } = criarClienteRestFalso();

    expect(await sincronizarLancamentoVenda(cliente, venda('PENDENTE'), '2026-11-15')).toBe(
      'SEM_LANCAMENTO',
    );
    expect(chamadas).toHaveLength(0);
  });
});
