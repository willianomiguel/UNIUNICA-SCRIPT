const EM_RISCO = new Set(['EM_RISCO', 'ATRASADA']);

// Conta metas em risco ou já atrasadas.
export const countMetasEmRisco = (metas: Array<{ status?: unknown }>): number =>
  metas.filter((meta) => EM_RISCO.has(String(meta.status))).length;
