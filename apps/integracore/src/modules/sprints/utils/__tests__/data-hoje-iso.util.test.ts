import { describe, expect, it } from 'vitest';

import { dataHojeIso } from 'src/modules/sprints/utils/data-hoje-iso.util';

describe('dataHojeIso', () => {
  it('usa o fuso de São Paulo', () => {
    // 02:00 UTC ainda é o dia anterior em São Paulo (UTC-3)
    expect(dataHojeIso(new Date('2026-11-16T02:00:00Z'))).toBe('2026-11-15');
    expect(dataHojeIso(new Date('2026-11-15T15:00:00Z'))).toBe('2026-11-15');
  });

  it('aceita outro fuso', () => {
    expect(dataHojeIso(new Date('2026-11-16T02:00:00Z'), 'UTC')).toBe('2026-11-16');
  });
});
