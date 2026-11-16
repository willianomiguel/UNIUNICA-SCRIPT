import { type BulkActionResult } from 'src/modules/projetos/types/bulk-action-result';

// Monta o resumo de uma ação em lote a partir dos resultados por registro.
export const summarizeBulkResults = (
  results: BulkActionResult['results'],
): BulkActionResult => {
  const count = (status: BulkActionResult['results'][number]['status']) =>
    results.filter((result) => result.status === status).length;

  const failedCount = count('FAILED');

  return {
    ok: failedCount === 0,
    total: results.length,
    successCount: count('SUCCESS'),
    skippedCount: count('SKIPPED'),
    failedCount,
    results,
  };
};
