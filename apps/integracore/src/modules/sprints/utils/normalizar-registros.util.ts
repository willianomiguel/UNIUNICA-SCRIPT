// Normaliza a entrada em lote { records: [{ id }] } das ações de sprint.
// Ignora itens sem id e ids repetidos.
export const normalizarRegistros = (entrada: unknown): string[] => {
  if (!entrada || typeof entrada !== 'object') {
    return [];
  }

  const registros = (entrada as { records?: unknown }).records;

  if (!Array.isArray(registros)) {
    return [];
  }

  const ids: string[] = [];

  for (const registro of registros) {
    const id =
      registro && typeof registro === 'object'
        ? (registro as { id?: unknown }).id
        : undefined;

    if (typeof id === 'string' && id.length > 0 && !ids.includes(id)) {
      ids.push(id);
    }
  }

  return ids;
};
