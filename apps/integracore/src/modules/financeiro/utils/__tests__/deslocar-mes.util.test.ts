import { describe, expect, it } from 'vitest';

import { deslocarMes } from 'src/modules/financeiro/utils/deslocar-mes.util';

describe('deslocarMes', () => {
  it('avança e recua atravessando o ano', () => {
    expect(deslocarMes('2026-11', 2)).toBe('2027-01');
    expect(deslocarMes('2026-01', -1)).toBe('2025-12');
    expect(deslocarMes('2026-06', -17)).toBe('2025-01');
    expect(deslocarMes('2026-06', 0)).toBe('2026-06');
  });
});
