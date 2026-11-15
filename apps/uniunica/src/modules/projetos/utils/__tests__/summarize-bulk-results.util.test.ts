import { describe, expect, it } from 'vitest';

import { summarizeBulkResults } from 'src/modules/projetos/utils/summarize-bulk-results.util';

describe('summarizeBulkResults', () => {
  it('conta cada status', () => {
    const summary = summarizeBulkResults([
      { id: 'a', status: 'SUCCESS' },
      { id: 'b', status: 'SKIPPED' },
      { id: 'c', status: 'FAILED', message: 'erro' },
      { id: 'd', status: 'SUCCESS' },
    ]);

    expect(summary).toMatchObject({ ok: false, total: 4, successCount: 2, skippedCount: 1, failedCount: 1 });
  });

  it('lista vazia é ok', () => {
    expect(summarizeBulkResults([])).toMatchObject({ ok: true, total: 0 });
  });
});
