import { describe, expect, it } from 'vitest';

import { hojeIso } from 'src/modules/financeiro/utils/hoje-iso.util';

describe('hojeIso', () => {
  it('usa o fuso de Brasília por padrão', () => {
    // 02:00 UTC ainda é o dia anterior em São Paulo (UTC-3).
    expect(hojeIso(new Date('2026-11-16T02:00:00Z'))).toBe('2026-11-15');
  });

  it('aceita outro fuso', () => {
    expect(hojeIso(new Date('2026-11-16T02:00:00Z'), 'UTC')).toBe('2026-11-16');
  });
});
