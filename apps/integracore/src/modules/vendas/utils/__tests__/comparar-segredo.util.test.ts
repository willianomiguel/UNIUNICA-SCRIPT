import { describe, expect, it } from 'vitest';

import { compararSegredo } from 'src/modules/vendas/utils/comparar-segredo.util';

describe('compararSegredo', () => {
  it('matches only identical non-empty secrets', () => {
    expect(compararSegredo('abc', 'abc')).toBe(true);
    expect(compararSegredo('abc', 'abd')).toBe(false);
    expect(compararSegredo('abc', 'abcd')).toBe(false);
  });

  it('never matches empty values', () => {
    expect(compararSegredo('', '')).toBe(false);
    expect(compararSegredo(undefined, 'abc')).toBe(false);
    expect(compararSegredo('abc', null)).toBe(false);
  });
});
