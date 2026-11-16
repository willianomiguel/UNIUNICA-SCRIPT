// Returns a trimmed non-empty string (numbers are stringified), otherwise null.
export const lerTexto = (valor: unknown): string | null => {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return String(valor);
  }

  if (typeof valor !== 'string') {
    return null;
  }

  const texto = valor.trim();

  return texto === '' ? null : texto;
};
