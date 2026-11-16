import { describe, expect, it } from 'vitest';

import { dividirEmLotes } from 'src/modules/trafego/utils/dividir-em-lotes.util';

describe('dividirEmLotes', () => {
  it('divide em lotes do tamanho pedido', () => {
    expect(dividirEmLotes([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it('lista vazia e tamanho inválido', () => {
    expect(dividirEmLotes([], 3)).toEqual([]);
    expect(dividirEmLotes([1, 2], 0)).toEqual([[1], [2]]);
  });
});
