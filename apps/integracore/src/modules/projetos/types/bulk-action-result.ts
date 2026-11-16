// Resultado de uma ação em lote sobre ideias (Votar, Transformar em projeto).
export type BulkActionResult = {
  ok: boolean;
  total: number;
  successCount: number;
  skippedCount: number;
  failedCount: number;
  results: Array<{
    id: string;
    status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
    projetoId?: string;
    message?: string;
  }>;
};
