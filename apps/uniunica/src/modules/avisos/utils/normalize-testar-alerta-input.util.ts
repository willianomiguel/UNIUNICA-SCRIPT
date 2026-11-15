// Aceita { records: [{ id }] } (canônico) ou o corpo de uma rota HTTP com o mesmo formato.
export const normalizeTestarAlertaInput = (input: unknown): string[] => {
  if (typeof input !== 'object' || input === null) {
    return [];
  }

  const candidate = input as { requestContext?: unknown; body?: unknown };
  const source =
    candidate.requestContext !== undefined && typeof candidate.body === 'object'
      ? candidate.body
      : input;
  const records = (source as { records?: unknown } | null)?.records;

  if (!Array.isArray(records)) {
    return [];
  }

  const ids = records
    .map((record) => (typeof record === 'object' && record !== null ? (record as { id?: unknown }).id : undefined))
    .filter((id): id is string => typeof id === 'string' && id !== '');

  return [...new Set(ids)];
};
