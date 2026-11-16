import { describe, expect, it } from 'vitest';

import { normalizarRegistros } from 'src/modules/sprints/utils/normalizar-registros.util';

describe('normalizarRegistros', () => {
  it('extrai ids únicos', () => {
    expect(
      normalizarRegistros({ records: [{ id: 'a' }, { id: 'b' }, { id: 'a' }] }),
    ).toEqual(['a', 'b']);
  });

  it('ignora itens sem id e entradas inválidas', () => {
    expect(normalizarRegistros({ records: [{}, null, { id: '' }, { id: 3 }] })).toEqual([]);
    expect(normalizarRegistros({ records: [] })).toEqual([]);
    expect(normalizarRegistros({})).toEqual([]);
    expect(normalizarRegistros(null)).toEqual([]);
  });
});
