import { describe, expect, it } from 'vitest';

import { ehObjetoJson } from 'src/modules/vendas/utils/eh-objeto-json.util';

describe('ehObjetoJson', () => {
  it('accepts plain objects only', () => {
    expect(ehObjetoJson({ a: 1 })).toBe(true);
    expect(ehObjetoJson([])).toBe(false);
    expect(ehObjetoJson(null)).toBe(false);
    expect(ehObjetoJson('x')).toBe(false);
  });
});
