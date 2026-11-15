import { describe, expect, it } from 'vitest';

import { extrairItensLote } from 'src/modules/vendas/utils/extrair-itens-lote.util';

describe('extrairItensLote', () => {
  it('wraps a single object and unwraps arrays and batches', () => {
    expect(extrairItensLote({ idExterno: '1' })).toEqual([{ idExterno: '1' }]);
    expect(extrairItensLote([{ a: 1 }, { a: 2 }])).toHaveLength(2);
    expect(extrairItensLote({ vendas: [{ a: 1 }] })).toEqual([{ a: 1 }]);
    expect(extrairItensLote({ eventos: [{ a: 1 }] })).toEqual([{ a: 1 }]);
  });

  it('returns nothing for empty or non-JSON bodies', () => {
    expect(extrairItensLote(null)).toEqual([]);
    expect(extrairItensLote('texto')).toEqual([]);
  });
});
