import { describe, expect, it } from 'vitest';

import { extractBulkBody } from 'src/modules/projetos/utils/extract-bulk-body.util';

describe('extractBulkBody', () => {
  it('extrai o body de um payload de rota HTTP', () => {
    expect(extractBulkBody({ requestContext: {}, body: { records: [{ id: 'a' }] } })).toEqual({
      records: [{ id: 'a' }],
    });
    expect(extractBulkBody({ requestContext: {}, body: null })).toBeNull();
  });

  it('devolve a entrada direta como está', () => {
    expect(extractBulkBody({ records: [] })).toEqual({ records: [] });
    expect(extractBulkBody(null)).toBeNull();
  });
});
