// Accepts numbers and numeric strings ("197.5" or "197,50"); anything else is null.
export const lerNumero = (valor: unknown): number | null => {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : null;
  }

  if (typeof valor !== 'string' || valor.trim() === '') {
    return null;
  }

  const normalizado = valor.includes(',')
    ? valor.replace(/\./g, '').replace(',', '.')
    : valor;
  const numero = Number(normalizado.trim());

  return Number.isFinite(numero) ? numero : null;
};
