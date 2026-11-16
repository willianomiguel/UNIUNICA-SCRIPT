// "1234" ou "act_1234" → "act_1234"; vazio/ inválido → null.
export const normalizarIdContaMeta = (valor: unknown): string | null => {
  if (typeof valor !== 'string' && typeof valor !== 'number') {
    return null;
  }

  const texto = String(valor).trim().replace(/^act_/i, '');

  return /^\d+$/.test(texto) ? `act_${texto}` : null;
};
