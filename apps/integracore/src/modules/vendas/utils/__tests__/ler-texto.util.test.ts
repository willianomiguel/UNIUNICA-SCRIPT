import { describe, expect, it } from 'vitest';

import { lerTexto } from 'src/modules/vendas/utils/ler-texto.util';

describe('lerTexto', () => {
  it('trims strings and stringifies numbers', () => {
    expect(lerTexto('  oi ')).toBe('oi');
    expect(lerTexto(123)).toBe('123');
  });

  it('returns null for empty or non-text values', () => {
    expect(lerTexto('   ')).toBeNull();
    expect(lerTexto(undefined)).toBeNull();
    expect(lerTexto({})).toBeNull();
    expect(lerTexto(Number.NaN)).toBeNull();
  });
});
