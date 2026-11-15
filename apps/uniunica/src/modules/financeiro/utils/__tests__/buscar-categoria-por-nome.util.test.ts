import { describe, expect, it } from 'vitest';

import { buscarCategoriaPorNome } from 'src/modules/financeiro/utils/buscar-categoria-por-nome.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('buscarCategoriaPorNome', () => {
  it('encontra pelo nome exato ou devolve null', async () => {
    const { cliente } = criarClienteRestFalso({
      categoriasFinanceiras: [{ id: 'rec', nome: 'Receita de vendas' }],
    });

    expect(await buscarCategoriaPorNome(cliente, 'Receita de vendas')).toBe('rec');
    expect(await buscarCategoriaPorNome(cliente, 'Outra')).toBeNull();
  });
});
