import { describe, expect, it } from 'vitest';

import { lerDataIso } from 'src/modules/vendas/utils/ler-data-iso.util';

describe('lerDataIso', () => {
  it('reads ISO strings and unix timestamps', () => {
    expect(lerDataIso('2026-11-10T12:00:00-03:00')).toBe('2026-11-10T15:00:00.000Z');
    expect(lerDataIso(1_700_000_000)).toBe('2023-11-14T22:13:20.000Z');
    expect(lerDataIso(1_700_000_000_000)).toBe('2023-11-14T22:13:20.000Z');
    expect(lerDataIso('1700000000')).toBe('2023-11-14T22:13:20.000Z');
  });

  it('returns null for invalid input', () => {
    expect(lerDataIso('ontem')).toBeNull();
    expect(lerDataIso(null)).toBeNull();
    expect(lerDataIso('')).toBeNull();
  });
});
