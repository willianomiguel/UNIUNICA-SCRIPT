import { describe, expect, it } from 'vitest';

import { countLancamentosAtrasados } from 'src/modules/avisos/utils/count-lancamentos-atrasados.util';

describe('countLancamentosAtrasados', () => {
  it('conta ATRASADO e PENDENTE vencido', () => {
    expect(
      countLancamentosAtrasados(
        [
          { status: 'ATRASADO', vencimento: '2026-12-01' },
          { status: 'PENDENTE', vencimento: '2026-11-10' },
          { status: 'PENDENTE', vencimento: '2026-11-15' },
          { status: 'PENDENTE', vencimento: null },
          { status: 'PAGO', vencimento: '2026-01-01' },
        ],
        '2026-11-15',
      ),
    ).toBe(2);
  });
});
