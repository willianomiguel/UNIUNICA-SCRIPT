import { describe, expect, it } from 'vitest';

import { extractRestRecords } from 'src/modules/avisos/utils/extract-rest-records.util';

describe('extractRestRecords', () => {
  it('lê data.<plural> e descarta itens inválidos', () => {
    expect(extractRestRecords({ data: { vendas: [{ id: '1' }, null, 3] } }, 'vendas')).toEqual([{ id: '1' }]);
  });

  it('retorna vazio para formatos inesperados', () => {
    expect(extractRestRecords(null, 'vendas')).toEqual([]);
    expect(extractRestRecords({ data: {} }, 'vendas')).toEqual([]);
    expect(extractRestRecords({ data: { vendas: 'x' } }, 'vendas')).toEqual([]);
  });
});
