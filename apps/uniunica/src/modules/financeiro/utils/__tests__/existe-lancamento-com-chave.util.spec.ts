import { describe, expect, it } from 'vitest';

import { existeLancamentoComChave } from 'src/modules/financeiro/utils/existe-lancamento-com-chave.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('existeLancamentoComChave', () => {
  it('procura pela chave exata', async () => {
    const { cliente } = criarClienteRestFalso({
      lancamentos: [{ id: '1', chaveIdempotencia: 'venda:1:entrada' }],
    });

    expect(await existeLancamentoComChave(cliente, 'venda:1:entrada')).toBe(true);
    expect(await existeLancamentoComChave(cliente, 'venda:2:entrada')).toBe(false);
  });
});
