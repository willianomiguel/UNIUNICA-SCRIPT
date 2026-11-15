import { describe, expect, it } from 'vitest';

import { normalizeBulkRecordsInput } from 'src/modules/projetos/utils/normalize-bulk-records-input.util';

describe('normalizeBulkRecordsInput', () => {
  it('extrai ids únicos e válidos', () => {
    expect(
      normalizeBulkRecordsInput({ records: [{ id: 'a' }, { id: ' b ' }, { id: 'a' }, { id: '' }, {}, null, { id: 3 }] }),
    ).toEqual(['a', 'b']);
  });

  it('entrada vazia ou malformada resulta em []', () => {
    expect(normalizeBulkRecordsInput({ records: [] })).toEqual([]);
    expect(normalizeBulkRecordsInput({})).toEqual([]);
    expect(normalizeBulkRecordsInput(null)).toEqual([]);
    expect(normalizeBulkRecordsInput({ records: 'a' })).toEqual([]);
  });
});
