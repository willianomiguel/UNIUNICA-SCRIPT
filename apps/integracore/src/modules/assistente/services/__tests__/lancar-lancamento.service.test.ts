import { describe, expect, it } from 'vitest';

import { lancarLancamento } from 'src/modules/assistente/services/lancar-lancamento.service';
import { validarEntradaLancar } from 'src/modules/assistente/utils/validar-entrada-lancar.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

const entradaDe = (extra: Record<string, unknown>) => {
  const entrada = validarEntradaLancar({ descricao: 'Notion', valor: 0.1 + 0.2, tipo: 'SAIDA', ...extra }, '2026-11-15');

  if (!entrada.ok) {
    throw new Error(entrada.erro);
  }

  return entrada.valor;
};

describe('lancarLancamento', () => {
  it('cria o lançamento com a categoria encontrada e valor em micros por centavos inteiros', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'cat-1', nome: 'Ferramentas/SaaS', tipo: 'SAIDA' }],
    });
    const resultado = await lancarLancamento(cliente, entradaDe({ categoria: 'Ferramentas/SaaS' }));

    expect(resultado).toMatchObject({ ok: true, categoria: 'Ferramentas/SaaS', valor: 0.3 });
    expect(banco.lancamentos).toHaveLength(1);
    expect(banco.lancamentos[0]).toMatchObject({
      categoriaId: 'cat-1',
      valor: { amountMicros: 300_000, currencyCode: 'BRL' },
      origem: 'MANUAL',
    });
  });

  it('acha a categoria ignorando caixa e acento', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'cat-2', nome: 'Tráfego pago', tipo: 'SAIDA' }],
    });
    const resultado = await lancarLancamento(cliente, entradaDe({ categoria: 'trafego pago' }));

    expect(resultado).toMatchObject({ ok: true, categoria: 'Tráfego pago' });
    expect(banco.lancamentos[0]).toMatchObject({ categoriaId: 'cat-2' });
  });

  it('categoria inexistente não grava e devolve as disponíveis', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'cat-1', nome: 'Salários', tipo: 'SAIDA' }],
    });
    const resultado = await lancarLancamento(cliente, entradaDe({ categoria: 'Viagens' }));

    expect(resultado).toMatchObject({ ok: false, categoriasDisponiveis: ['Salários'] });
    expect(banco.lancamentos ?? []).toHaveLength(0);
  });

  it('sem categoria grava com categoriaId null', async () => {
    const { cliente, banco } = criarClienteRestFalso();

    expect(await lancarLancamento(cliente, entradaDe({}))).toMatchObject({ ok: true, categoria: null });
    expect(banco.lancamentos[0]).toMatchObject({ categoriaId: null });
  });
});
