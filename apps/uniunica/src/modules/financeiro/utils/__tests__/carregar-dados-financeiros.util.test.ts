import { describe, expect, it } from 'vitest';

import { carregarDadosFinanceiros } from 'src/modules/financeiro/utils/carregar-dados-financeiros.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('carregarDadosFinanceiros', () => {
  it('carrega e normaliza lançamentos e categorias', async () => {
    const { cliente } = criarClienteRestFalso({
      lancamentos: [{ id: 'l', tipo: 'ENTRADA', valor: { amountMicros: 1_000_000 } }],
      categoriasFinanceiras: [{ id: 'c', nome: 'Outros', tipo: 'SAIDA' }],
    });

    const dados = await carregarDadosFinanceiros(cliente);

    expect(dados.lancamentos[0]).toMatchObject({ id: 'l', tipo: 'ENTRADA', valor: 1 });
    expect(dados.categorias).toEqual([{ id: 'c', nome: 'Outros', tipo: 'SAIDA', orcamentoMensal: 0 }]);
  });
});
