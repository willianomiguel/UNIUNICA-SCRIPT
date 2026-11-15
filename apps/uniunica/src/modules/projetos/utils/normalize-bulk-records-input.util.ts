// Extrai os IDs únicos de uma entrada em lote `{ records: [{ id }] }`.
// Ignora entradas sem `id` válido; entrada malformada resulta em lista vazia.
export const normalizeBulkRecordsInput = (input: unknown): string[] => {
  const records = (input as { records?: unknown } | null | undefined)?.records;

  if (!Array.isArray(records)) {
    return [];
  }

  const ids = records
    .map((record) => (record as { id?: unknown } | null)?.id)
    .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    .map((id) => id.trim());

  return [...new Set(ids)];
};
