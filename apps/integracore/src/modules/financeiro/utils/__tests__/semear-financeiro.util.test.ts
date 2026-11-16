import { describe, expect, it } from 'vitest';

import { semearFinanceiro } from 'src/modules/financeiro/utils/semear-financeiro.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('semearFinanceiro', () => {
  it('cria só as categorias que faltam, com orçamento zero, e é idempotente', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'existente', nome: 'Impostos' }],
    });

    expect(await semearFinanceiro(cliente)).toEqual({ categoriasCriadas: 5 });

    const criadas = banco.categoriasFinanceiras.filter((categoria) => categoria.id !== 'existente');

    expect(criadas.map((categoria) => categoria.nome)).toContain('Receita de vendas');
    for (const categoria of criadas) {
      expect(categoria.orcamentoMensal).toEqual({ amountMicros: 0, currencyCode: 'BRL' });
    }

    const copia = JSON.stringify(banco);

    expect(await semearFinanceiro(cliente)).toEqual({ categoriasCriadas: 0 });
    expect(JSON.stringify(banco)).toBe(copia);
  });

  it('não cria nenhum lançamento de exemplo', async () => {
    const { cliente, banco } = criarClienteRestFalso({});

    await semearFinanceiro(cliente);

    expect(banco.lancamentos ?? []).toHaveLength(0);
  });
});
