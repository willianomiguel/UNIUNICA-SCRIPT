import { describe, expect, it } from 'vitest';

import { lerObjeto } from 'src/modules/vendas/utils/ler-objeto.util';

describe('lerObjeto', () => {
  it('reads nested objects by path', () => {
    expect(lerObjeto({ a: { b: { c: 1 } } }, 'a', 'b')).toEqual({ c: 1 });
  });

  it('returns an empty object when a step is missing or not an object', () => {
    expect(lerObjeto({ a: 1 }, 'a', 'b')).toEqual({});
    expect(lerObjeto(null)).toEqual({});
    expect(lerObjeto({ a: [1] }, 'a')).toEqual({});
  });
});
