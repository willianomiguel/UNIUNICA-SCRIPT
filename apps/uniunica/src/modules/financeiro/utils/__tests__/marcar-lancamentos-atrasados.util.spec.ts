import { describe, expect, it } from 'vitest';

import { marcarLancamentosAtrasados } from 'src/modules/financeiro/utils/marcar-lancamentos-atrasados.util';
import { criarClienteRestFalso } from 'src/modules/financeiro/utils/__tests__/helpers/criar-cliente-rest-falso';

describe('marcarLancamentosAtrasados', () => {
  it('marca só pendentes vencidos e é idempotente', async () => {
    const { cliente, banco } = criarClienteRestFalso({
      lancamentos: [
        { id: 'a', status: 'PENDENTE', vencimento: '2026-11-01' },
        { id: 'b', status: 'PENDENTE', vencimento: '2026-11-20' },
        { id: 'c', status: 'PAGO', vencimento: '2026-01-01' },
        { id: 'd', status: 'PENDENTE', data: '2026-10-01' },
      ],
    });

    expect(await marcarLancamentosAtrasados(cliente, '2026-11-15')).toEqual(['a', 'd']);
    expect(banco.lancamentos.map((registro) => registro.status)).toEqual([
      'ATRASADO',
      'PENDENTE',
      'PAGO',
      'ATRASADO',
    ]);
    expect(await marcarLancamentosAtrasados(cliente, '2026-11-15')).toEqual([]);
  });
});
