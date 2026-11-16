import { describe, expect, it } from 'vitest';

import { formatarMoedaBrl } from 'src/modules/vendas/utils/formatar-moeda-brl.util';

describe('formatarMoedaBrl', () => {
  it('formats reais in pt-BR', () => {
    expect(formatarMoedaBrl(1234.5)).toBe('R$ 1.234,50');
    expect(formatarMoedaBrl(0)).toBe('R$ 0,00');
  });
});
