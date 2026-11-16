// Corpo de uma chamada em lote: rotas HTTP entregam `{ body, requestContext, ... }`,
// enquanto chamadas diretas (ex.: workflow) entregam o próprio corpo.
export const extractBulkBody = (input: unknown): unknown => {
  if (input !== null && typeof input === 'object' && 'requestContext' in input) {
    return (input as { body?: unknown }).body ?? null;
  }

  return input;
};
