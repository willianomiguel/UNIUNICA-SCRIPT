// Extrai a lista de registros de uma resposta REST de listagem: { data: { <plural>: [...] } }.
export const extractRestRecords = (
  payload: unknown,
  namePlural: string,
): Array<Record<string, unknown>> => {
  if (typeof payload !== 'object' || payload === null) {
    return [];
  }

  const data = (payload as { data?: unknown }).data;
  const list =
    typeof data === 'object' && data !== null
      ? (data as Record<string, unknown>)[namePlural]
      : undefined;

  return Array.isArray(list)
    ? list.filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      )
    : [];
};
