import { describe, expect, it } from 'vitest';

import { formatarPercentual } from 'src/modules/vendas/utils/formatar-percentual.util';

describe('formatarPercentual', () => {
  it('formats fractions with one decimal and a comma', () => {
    expect(formatarPercentual(0.125)).toBe('12,5%');
    expect(formatarPercentual(1)).toBe('100,0%');
    expect(formatarPercentual(0)).toBe('0,0%');
    expect(formatarPercentual(2 / 3)).toBe('66,7%');
  });
});
