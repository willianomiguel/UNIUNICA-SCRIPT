import { describe, expect, it } from 'vitest';

import { listarRegistros } from 'src/modules/financeiro/utils/listar-registros.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('listarRegistros', () => {
  it('percorre todas as páginas', async () => {
    const registros = Array.from({ length: 450 }, (_, indice) => ({ id: String(indice) }));
    const { cliente, chamadas } = criarClienteRestFalso({ lancamentos: registros });

    const resultado = await listarRegistros(cliente, 'lancamentos');

    expect(resultado).toHaveLength(450);
    expect(chamadas).toHaveLength(3);
  });

  it('repassa o filtro e lida com resposta vazia', async () => {
    const { cliente } = criarClienteRestFalso({
      lancamentos: [
        { id: '1', status: 'PENDENTE' },
        { id: '2', status: 'PAGO' },
      ],
    });

    expect(await listarRegistros(cliente, 'lancamentos', 'status[eq]:PENDENTE')).toEqual([
      { id: '1', status: 'PENDENTE' },
    ]);
    expect(await listarRegistros(cliente, 'outros')).toEqual([]);
  });
});
