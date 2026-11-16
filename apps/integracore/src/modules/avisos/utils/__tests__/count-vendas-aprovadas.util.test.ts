import { describe, expect, it } from 'vitest';

import { countVendasAprovadas } from 'src/modules/avisos/utils/count-vendas-aprovadas.util';

describe('countVendasAprovadas', () => {
  it('conta apenas APROVADA', () => {
    expect(countVendasAprovadas([{ status: 'APROVADA' }, { status: 'PENDENTE' }, { status: 'APROVADA' }])).toBe(2);
    expect(countVendasAprovadas([])).toBe(0);
  });
});
