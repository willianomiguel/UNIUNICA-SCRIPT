import { describe, expect, it } from 'vitest';

import { formatarMes } from 'src/modules/financeiro/utils/formatar-mes.util';

describe('formatarMes', () => {
  it('abrevia o mês em português', () => {
    expect(formatarMes('2026-11')).toBe('nov/2026');
    expect(formatarMes('2027-01')).toBe('jan/2027');
  });
});
